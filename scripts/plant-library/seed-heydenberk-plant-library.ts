import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient, type WebSocketLikeConstructor } from "@supabase/supabase-js"
import WebSocket from "ws"

import { HEYDENBERK_SOURCE, type PlantLibraryImportRow } from "../../lib/plant-library/import/plant-library-import-types"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.join(__dirname, "..", "..")

const candidatesPath = path.join(
  repoRoot,
  "docs",
  "data",
  "plant-library",
  "heydenberk-seed-candidates.json",
)
const reportJsonPath = path.join(repoRoot, "docs", "data", "plant-library", "heydenberk-seed-report.json")
const reportMdPath = path.join(repoRoot, "docs", "data", "plant-library", "heydenberk-seed-report.md")

const CHUNK_SIZE = 50

interface SeedCandidateEntry {
  seedStatus: string
  sourceFile?: string
  sourceSlug?: string
  row: PlantLibraryImportRow & Record<string, unknown>
}

interface SeedCandidatesFile {
  generatedAt?: string
  previewGeneratedAt?: string
  source?: string
  summary?: {
    totalPreviewRows?: number
    included?: number
    includedWithWarning?: number
    excluded?: number
    needsManualReview?: number
  }
  resolutions?: Array<{
    source_key: string
    included: boolean
    seedStatus: string
  }>
  candidates?: SeedCandidateEntry[]
}

interface SeedReport {
  generatedAt: string
  mode: "dry-run" | "applied"
  targetHost: string | null
  totalCandidatesInFile: number
  approvedForUpsert: number
  attemptedRows: number
  chunkSize: number
  chunksRun: number
  rowsReturnedFromUpsert: number | null
  skippedRows: string[]
  errors: Array<{ chunkIndex: number; message: string }>
  sourceCounts: Record<string, number>
  warningCount: number
  includedWithWarningKeys: string[]
  excludedResolutionsCount: number
  excludedSourceKeysNotSeeded: string[]
  excludedRowsConfirmedAbsentFromPayload: boolean
  noUiChanges: true
  rlsAndReadModelUnchanged: true
  usedServiceRoleFromEnv: boolean
  notes: string[]
}

function parseFlags(argv: string[]) {
  const set = new Set(argv)
  return {
    apply: set.has("--apply"),
    confirmPreview: set.has("--confirm-preview"),
  }
}

function readCandidates(): SeedCandidatesFile {
  if (!fs.existsSync(candidatesPath)) {
    throw new Error(`Missing seed candidates file: ${candidatesPath}`)
  }
  return JSON.parse(fs.readFileSync(candidatesPath, "utf8")) as SeedCandidatesFile
}

function validateCandidates(doc: SeedCandidatesFile): {
  rows: PlantLibraryImportRow[]
  includedWithWarningKeys: string[]
  excludedKeys: string[]
  warningCount: number
} {
  const resolutions = doc.resolutions ?? []
  const excludedKeys = resolutions.filter((r) => r.seedStatus === "excluded").map((r) => r.source_key)

  const candidates = doc.candidates ?? []
  const summ = doc.summary
  if (summ) {
    const expectedFromSummary = (summ.included ?? 0) + (summ.includedWithWarning ?? 0)
    if (expectedFromSummary !== candidates.length) {
      throw new Error(
        `candidates[] length (${candidates.length}) does not match summary included+includedWithWarning (${expectedFromSummary}). Regenerate with npm run plant-library:seed-candidates:heydenberk.`,
      )
    }
  }

  const badStatus = candidates.filter(
    (c) => c.seedStatus !== "included" && c.seedStatus !== "included_with_warning",
  )
  if (badStatus.length > 0) {
    throw new Error(
      `Seed file contains candidates with disallowed seedStatus values: ${badStatus
        .map((c) => `${c.row?.source_key}:${c.seedStatus}`)
        .join(", ")}`,
    )
  }

  const includedWithWarningKeys = candidates
    .filter((c) => c.seedStatus === "included_with_warning")
    .map((c) => c.row.source_key)

  const keys = new Set<string>()
  const rows: PlantLibraryImportRow[] = []
  for (const c of candidates) {
    const row = c.row
    if (!row || typeof row !== "object") {
      throw new Error("Candidate missing row object")
    }
    if (row.source !== HEYDENBERK_SOURCE) {
      throw new Error(`Candidate ${row.source_key}: expected source ${HEYDENBERK_SOURCE}, got ${String(row.source)}`)
    }
    if (!row.source_key || typeof row.source_key !== "string") {
      throw new Error("Candidate missing source_key")
    }
    if (keys.has(row.source_key)) {
      throw new Error(`Duplicate source_key in candidates payload: ${row.source_key}`)
    }
    keys.add(row.source_key)

    for (const ex of excludedKeys) {
      if (ex === row.source_key) {
        throw new Error(`Excluded resolution source_key ${ex} must not appear in candidates[]`)
      }
    }

    rows.push(row as PlantLibraryImportRow)
  }

  const warningCount = includedWithWarningKeys.length

  return {
    rows,
    includedWithWarningKeys,
    excludedKeys,
    warningCount,
  }
}

function countBySource(rows: PlantLibraryImportRow[]): Record<string, number> {
  const m: Record<string, number> = {}
  for (const r of rows) {
    m[r.source] = (m[r.source] ?? 0) + 1
  }
  return m
}

function supabaseHost(urlStr: string): string {
  let u: URL
  try {
    u = new URL(urlStr)
  } catch {
    throw new Error("SUPABASE_URL is not a valid URL")
  }
  return u.hostname
}

function assertApplySafe(urlStr: string, flags: { apply: boolean; confirmPreview: boolean }) {
  if (!flags.apply) return

  if (!flags.confirmPreview) {
    throw new Error("Refusing --apply without --confirm-preview (preview-branch intent flag).")
  }

  const blocked = (process.env.GARDEN_PLANT_LIBRARY_SEED_BLOCKED_HOSTS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
  const host = supabaseHost(urlStr)
  if (blocked.includes(host)) {
    throw new Error(
      `Refusing apply: host ${host} is listed in GARDEN_PLANT_LIBRARY_SEED_BLOCKED_HOSTS. Remove it or use a preview branch URL.`,
    )
  }

  const mainHost = process.env.GARDEN_SUPABASE_MAIN_PROJECT_HOST?.trim()
  if (mainHost && host === mainHost) {
    throw new Error(
      `Refusing apply: SUPABASE_URL host matches GARDEN_SUPABASE_MAIN_PROJECT_HOST (${mainHost}). Use a preview branch URL for Phase 9B.`,
    )
  }
}

function toUpsertPayload(row: PlantLibraryImportRow) {
  const now = new Date().toISOString()
  return {
    source: row.source,
    source_key: row.source_key,
    common_name: row.common_name,
    scientific_name: row.scientific_name,
    category: row.category,
    edible: row.edible,
    sunlight: row.sunlight,
    water: row.water,
    spacing_inches: row.spacing_inches,
    days_to_maturity: row.days_to_maturity,
    care_summary: row.care_summary,
    watch_out_for: row.watch_out_for,
    metadata: row.metadata,
    updated_at: now,
  }
}

function writeReports(report: SeedReport, md: string) {
  fs.mkdirSync(path.dirname(reportJsonPath), { recursive: true })
  fs.writeFileSync(reportJsonPath, JSON.stringify(report, null, 2), "utf8")
  fs.writeFileSync(reportMdPath, md, "utf8")
  process.stdout.write(`Wrote ${path.relative(repoRoot, reportJsonPath)}\n`)
  process.stdout.write(`Wrote ${path.relative(repoRoot, reportMdPath)}\n`)
}

function buildMarkdown(report: SeedReport, doc: SeedCandidatesFile): string {
  const lines: string[] = []
  lines.push("# Heydenberk plant_library seed report (Phase 9B)")
  lines.push("")
  lines.push(`Generated: **${report.generatedAt}**`)
  lines.push(`Mode: **${report.mode}**`)
  lines.push(`Target host: **${report.targetHost ?? "(dry-run — no network)"}**`)
  lines.push("")
  lines.push("## Safety contract")
  lines.push("")
  lines.push("- **No UI changes** — `/plants` and `/my-garden` remain demo/local as before.")
  lines.push("- **RLS / read model unchanged** by this script; verify policies before any UI reads from `plant_library`.")
  lines.push("- **Excluded seed candidates** were validated and are **not** present in the upsert payload.")
  lines.push("- **Service role key** is never printed; use local env only for `--apply`.")
  lines.push("")
  lines.push("## Summary")
  lines.push("")
  lines.push(`| Metric | Value |`)
  lines.push(`| --- | --- |`)
  lines.push(`| Candidates in file | ${report.totalCandidatesInFile} |`)
  lines.push(`| Approved for upsert | ${report.approvedForUpsert} |`)
  lines.push(`| Attempted rows | ${report.attemptedRows} |`)
  lines.push(`| Chunk size | ${report.chunkSize} |`)
  lines.push(`| Chunks run | ${report.chunksRun} |`)
  lines.push(`| Rows returned from PostgREST upsert | ${report.rowsReturnedFromUpsert ?? "n/a"} |`)
  lines.push(`| Warning rows (included_with_warning) | ${report.warningCount} |`)
  lines.push(`| Excluded resolutions (from file) | ${report.excludedResolutionsCount} |`)
  lines.push("")
  if (report.includedWithWarningKeys.length) {
    lines.push("### included_with_warning")
    lines.push("")
    for (const k of report.includedWithWarningKeys) {
      lines.push(`- **${k}**`)
    }
    lines.push("")
  }
  lines.push("### Source counts (payload)")
  lines.push("")
  for (const [k, v] of Object.entries(report.sourceCounts)) {
    lines.push(`- \`${k}\`: **${v}**`)
  }
  lines.push("")
  if (report.skippedRows.length) {
    lines.push("## Skipped rows")
    lines.push("")
    for (const s of report.skippedRows) {
      lines.push(`- ${s}`)
    }
    lines.push("")
  }
  if (report.errors.length) {
    lines.push("## Errors")
    lines.push("")
    for (const e of report.errors) {
      lines.push(`- Chunk ${e.chunkIndex}: ${e.message}`)
    }
    lines.push("")
  }
  if (report.notes.length) {
    lines.push("## Notes")
    lines.push("")
    for (const n of report.notes) {
      lines.push(`- ${n}`)
    }
    lines.push("")
  }
  lines.push("## Inputs")
  lines.push("")
  lines.push(`- Seed candidates: \`${path.relative(repoRoot, candidatesPath)}\``)
  lines.push(`- Preview generated at (from file): \`${doc.previewGeneratedAt ?? "(field absent)"}\``)
  lines.push("")
  return lines.join("\n")
}

async function main() {
  const flags = parseFlags(process.argv.slice(2))
  const doc = readCandidates()
  const { rows, includedWithWarningKeys, excludedKeys, warningCount } = validateCandidates(doc)

  const supabaseUrl = process.env.SUPABASE_URL?.trim() ?? ""
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? ""

  const notes: string[] = [
    "Production bulk seed is deferred until after human review; Phase 9B targets preview/dev branches only.",
  ]

  if (flags.apply) {
    if (!flags.confirmPreview) {
      throw new Error("Refusing --apply without --confirm-preview (preview-branch intent flag).")
    }
    if (!supabaseUrl || !serviceKey) {
      throw new Error("--apply requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.")
    }
    assertApplySafe(supabaseUrl, flags)
  } else if (!supabaseUrl) {
    notes.push("SUPABASE_URL not set — dry-run only (no network).")
  }

  const generatedAt = new Date().toISOString()
  const targetHost = supabaseUrl ? supabaseHost(supabaseUrl) : null

  const baseReport: SeedReport = {
    generatedAt,
    mode: flags.apply ? "applied" : "dry-run",
    targetHost,
    totalCandidatesInFile: doc.candidates?.length ?? 0,
    approvedForUpsert: rows.length,
    attemptedRows: rows.length,
    chunkSize: CHUNK_SIZE,
    chunksRun: 0,
    rowsReturnedFromUpsert: null,
    skippedRows: [],
    errors: [],
    sourceCounts: countBySource(rows),
    warningCount,
    includedWithWarningKeys,
    excludedResolutionsCount: excludedKeys.length,
    excludedSourceKeysNotSeeded: excludedKeys,
    excludedRowsConfirmedAbsentFromPayload: true,
    noUiChanges: true,
    rlsAndReadModelUnchanged: true,
    usedServiceRoleFromEnv: flags.apply,
    notes,
  }

  if (!flags.apply) {
    const md = buildMarkdown(baseReport, doc)
    writeReports(baseReport, md)
    process.stdout.write(
      `Dry-run complete: ${rows.length} row(s) ready for upsert. Pass --apply --confirm-preview to write (preview branch only).\n`,
    )
    return
  }

  process.stdout.write(`\nAPPLY: target host ${targetHost}\n`)
  process.stdout.write("Using Supabase service role from env (value not printed).\n\n")

  const client = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: {
      // Node.js 20 has no global WebSocket; realtime-js needs an explicit transport.
      transport: WebSocket as unknown as WebSocketLikeConstructor,
    },
  })

  const payloads = rows.map(toUpsertPayload)
  let rowsReturned = 0
  let chunksRun = 0
  const errors: Array<{ chunkIndex: number; message: string }> = []

  for (let i = 0; i < payloads.length; i += CHUNK_SIZE) {
    const chunk = payloads.slice(i, i + CHUNK_SIZE)
    const chunkIndex = chunksRun
    chunksRun += 1
    const { data, error } = await client
      .from("plant_library")
      .upsert(chunk, { onConflict: "source,source_key" })
      .select("id")

    if (error) {
      errors.push({ chunkIndex, message: error.message })
    } else if (data) {
      rowsReturned += data.length
    }
  }

  const finalReport: SeedReport = {
    ...baseReport,
    chunksRun,
    rowsReturnedFromUpsert: rowsReturned,
    errors,
    notes:
      errors.length > 0
        ? [...notes, "One or more chunks failed; inspect errors and re-run after fixing the database or payload."]
        : notes,
  }

  const md = buildMarkdown(finalReport, doc)
  writeReports(finalReport, md)

  if (errors.length) {
    process.stderr.write(`Seed finished with ${errors.length} chunk error(s).\n`)
    process.exitCode = 1
  } else {
    process.stdout.write(`Apply complete: ${rowsReturned} row id(s) returned from upsert.\n`)
  }
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err)
  process.stderr.write(`${msg}\n`)
  process.exitCode = 1
})
