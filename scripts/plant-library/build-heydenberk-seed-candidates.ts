import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.join(__dirname, "..", "..")

const previewPath = path.join(
  repoRoot,
  "docs",
  "data",
  "plant-library",
  "heydenberk-plant-library-preview.json",
)
const overridesPath = path.join(
  repoRoot,
  "docs",
  "data",
  "plant-library",
  "heydenberk-review-overrides.json",
)
const outDir = path.join(repoRoot, "docs", "data", "plant-library")
const outJson = path.join(outDir, "heydenberk-seed-candidates.json")
const outMd = path.join(outDir, "heydenberk-seed-candidates.md")

type SourceQuality = "high" | "medium" | "low" | "needs_review"

type OverrideAction = "include" | "include_with_warning" | "exclude" | "needs_manual_review"

interface ReviewOverride {
  action: OverrideAction
  reason: string
  notes?: string
}

type OverrideFile = Record<string, ReviewOverride>

interface PreviewRow {
  sourceFile: string
  sourceSlug: string
  sourceQuality: SourceQuality
  importWarnings: unknown[]
  blockedFromImport?: boolean
  safeForPreviewBranchImport?: boolean
  row: {
    source_key: string
    metadata?: { importWarnings?: unknown[] }
    [key: string]: unknown
  }
}

interface PreviewFile {
  generatedAt?: string
  source?: string
  rows: PreviewRow[]
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T
}

function defaultIncludeForQuality(q: SourceQuality): boolean {
  return q === "high" || q === "medium"
}

interface SeedResolution {
  source_key: string
  included: boolean
  seedStatus: "included" | "included_with_warning" | "excluded" | "needs_manual_review"
  sourceQuality: SourceQuality
  defaultWouldInclude: boolean
  override?: ReviewOverride
  excludeReason?: string
}

function resolveRow(
  preview: PreviewRow,
  overrides: OverrideFile,
): { resolution: SeedResolution; candidate?: PreviewRow & { seedStatus: "included" | "included_with_warning" } } {
  const source_key = preview.row?.source_key ?? preview.sourceSlug
  const o = overrides[source_key]
  const q = preview.sourceQuality
  const defaultIn = defaultIncludeForQuality(q)

  let excludeReason: string | undefined

  if (o?.action === "needs_manual_review") {
    return {
      resolution: {
        source_key,
        included: false,
        seedStatus: "needs_manual_review",
        sourceQuality: q,
        defaultWouldInclude: defaultIn,
        override: o,
        excludeReason: o.reason,
      },
    }
  }

  if (o?.action === "exclude") {
    return {
      resolution: {
        source_key,
        included: false,
        seedStatus: "excluded",
        sourceQuality: q,
        defaultWouldInclude: defaultIn,
        override: o,
        excludeReason: o.reason,
      },
    }
  }

  if (o?.action === "include" || o?.action === "include_with_warning") {
    const st: "included" | "included_with_warning" =
      o.action === "include_with_warning" ? "included_with_warning" : "included"
    return {
      resolution: {
        source_key,
        included: true,
        seedStatus: st,
        sourceQuality: q,
        defaultWouldInclude: defaultIn,
        override: o,
      },
      candidate: { ...preview, seedStatus: st },
    }
  }

  if (!defaultIn) {
    excludeReason =
      q === "needs_review"
        ? "Default: needs_review rows are excluded until corrected or overridden."
        : "Default: low quality rows are excluded unless an override explicitly includes them."
    return {
      resolution: {
        source_key,
        included: false,
        seedStatus: "excluded",
        sourceQuality: q,
        defaultWouldInclude: defaultIn,
        excludeReason,
      },
    }
  }

  return {
    resolution: {
      source_key,
      included: true,
      seedStatus: "included",
      sourceQuality: q,
      defaultWouldInclude: true,
    },
    candidate: { ...preview, seedStatus: "included" as const },
  }
}

function main() {
  if (!fs.existsSync(previewPath)) {
    throw new Error(`Missing preview file: ${previewPath}`)
  }
  if (!fs.existsSync(overridesPath)) {
    throw new Error(`Missing overrides file: ${overridesPath}`)
  }

  const preview = readJson<PreviewFile>(previewPath)
  const overrides = readJson<OverrideFile>(overridesPath)

  const resolutions: SeedResolution[] = []
  const candidates: Array<PreviewRow & { seedStatus: "included" | "included_with_warning" }> = []

  for (const row of preview.rows) {
    const { resolution, candidate } = resolveRow(row, overrides)
    resolutions.push(resolution)
    if (candidate) candidates.push(candidate)
  }

  const totalPreviewRows = preview.rows.length
  const included = resolutions.filter((r) => r.included && r.seedStatus === "included").length
  const includedWithWarning = resolutions.filter((r) => r.included && r.seedStatus === "included_with_warning")
    .length
  const excluded = resolutions.filter((r) => !r.included && r.seedStatus === "excluded").length
  const needsManualReview = resolutions.filter((r) => r.seedStatus === "needs_manual_review").length

  const excludedList = resolutions
    .filter((r) => !r.included)
    .map((r) => ({
      source_key: r.source_key,
      sourceQuality: r.sourceQuality,
      seedStatus: r.seedStatus,
      reason: r.excludeReason ?? r.override?.reason ?? "(no reason recorded)",
      override: r.override,
    }))

  const includedKeys = resolutions.filter((r) => r.included).map((r) => r.source_key)

  const payload = {
    generatedAt: new Date().toISOString(),
    source: preview.source ?? "heydenberk/gardening-data",
    previewGeneratedAt: preview.generatedAt,
    noSupabaseWrites: true as const,
    summary: {
      totalPreviewRows,
      included,
      includedWithWarning,
      excluded,
      needsManualReview,
    },
    resolutions,
    candidates: candidates.map((c) => ({
      seedStatus: c.seedStatus,
      sourceFile: c.sourceFile,
      sourceSlug: c.sourceSlug,
      sourceQuality: c.sourceQuality,
      importWarnings: c.importWarnings,
      blockedFromImport: c.blockedFromImport,
      safeForPreviewBranchImport: c.safeForPreviewBranchImport,
      row: c.row,
    })),
    excluded: excludedList,
    includedSourceKeys: includedKeys,
  }

  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(outJson, JSON.stringify(payload, null, 2), "utf8")

  const md: string[] = []
  md.push("# Heydenberk plant_library seed candidates (Phase 9A.1)")
  md.push("")
  md.push(`Generated: ${payload.generatedAt}`)
  md.push(`Preview snapshot: ${payload.previewGeneratedAt ?? "(unknown)"}`)
  md.push("")
  md.push("## Contract")
  md.push("")
  md.push(
    "**No Supabase writes occurred.** This file is derived from local JSON only (preview + review overrides). No migrations, no service role keys, no network calls.",
  )
  md.push("")
  md.push("## Summary")
  md.push("")
  md.push(`- Total preview rows: **${totalPreviewRows}**`)
  md.push(`- Included (status \`included\`): **${included}**`)
  md.push(`- Included with warning (status \`included_with_warning\`): **${includedWithWarning}**`)
  md.push(`- Excluded (status \`excluded\`): **${excluded}**`)
  md.push(`- Needs manual review (status \`needs_manual_review\`): **${needsManualReview}**`)
  md.push("")
  md.push("## Included source_keys")
  md.push("")
  for (const k of includedKeys) {
    md.push(`- **${k}**`)
  }
  md.push("")
  md.push("## Excluded / manual review (with reasons)")
  md.push("")
  for (const e of excludedList) {
    md.push(`- **${e.source_key}** (${e.sourceQuality}, ${e.seedStatus}): ${e.reason}`)
  }
  md.push("")
  md.push("## Inputs")
  md.push("")
  md.push(`- Preview: \`${path.relative(repoRoot, previewPath)}\``)
  md.push(`- Overrides: \`${path.relative(repoRoot, overridesPath)}\``)
  md.push("")
  md.push("## Output")
  md.push("")
  md.push(`- JSON: \`${path.relative(repoRoot, outJson)}\``)

  fs.writeFileSync(outMd, md.join("\n"), "utf8")

  process.stdout.write(`Wrote ${path.relative(repoRoot, outJson)}\n`)
  process.stdout.write(`Wrote ${path.relative(repoRoot, outMd)}\n`)
}

main()
