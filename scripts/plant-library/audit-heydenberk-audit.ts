import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { mapHeydenberkPlant } from "../../lib/plant-library/import/map-heydenberk-plant"
import type {
  PlantLibraryImportAuditSummary,
  PlantLibraryImportPreviewRow,
  PlantLibrarySourceQuality,
} from "../../lib/plant-library/import/plant-library-import-types"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.join(__dirname, "..", "..")

const defaultPlantsDir = path.join(repoRoot, "reference", "gardening-data", "plants")
const outDir = path.join(repoRoot, "docs", "data", "plant-library")
const outMd = path.join(outDir, "heydenberk-import-audit.md")
const outJson = path.join(outDir, "heydenberk-plant-library-preview.json")

function parseArgs(): { dir: string } {
  const argv = process.argv.slice(2)
  const fromFlag = argv.indexOf("--from")
  let dir = defaultPlantsDir
  if (fromFlag >= 0 && argv[fromFlag + 1]) {
    dir = path.resolve(argv[fromFlag + 1])
  }
  return { dir }
}

function emptyQualityCounts(): Record<PlantLibrarySourceQuality, number> {
  return {
    high: 0,
    medium: 0,
    low: 0,
    needs_review: 0,
  }
}

function main() {
  const { dir } = parseArgs()
  fs.mkdirSync(outDir, { recursive: true })

  const toolsDir = path.join(repoRoot, "reference", "gardening-data", "tools")
  const cakefile = path.join(toolsDir, "Cakefile")
  const scraper = path.join(toolsDir, "scrape-usda-ndl.js")
  const sourceFilesInspected: string[] = []
  if (fs.existsSync(cakefile)) sourceFilesInspected.push(path.relative(repoRoot, cakefile))
  if (fs.existsSync(scraper)) sourceFilesInspected.push(path.relative(repoRoot, scraper))

  const entries = fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : []
  const jsonFiles = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".json"))
    .map((e) => e.name)
    .filter((name) => name.toLowerCase() !== "index.json")
    .sort((a, b) => a.localeCompare(b))

  const totalFilesFound = entries.filter((e) => e.isFile()).length
  let parseFailures = 0
  const rows: PlantLibraryImportPreviewRow[] = []
  const parseErrors: { file: string; message: string }[] = []

  for (const name of jsonFiles) {
    const full = path.join(dir, name)
    let text: string
    try {
      text = fs.readFileSync(full, "utf8")
    } catch (e) {
      parseFailures += 1
      parseErrors.push({ file: name, message: e instanceof Error ? e.message : String(e) })
      continue
    }
    let raw: unknown
    try {
      raw = JSON.parse(text) as unknown
    } catch (e) {
      parseFailures += 1
      parseErrors.push({ file: name, message: e instanceof Error ? e.message : String(e) })
      continue
    }

    try {
      rows.push(mapHeydenberkPlant({ sourceFileBasename: name, raw }))
    } catch (e) {
      parseFailures += 1
      parseErrors.push({ file: name, message: e instanceof Error ? e.message : String(e) })
    }
  }

  const qualityCounts = emptyQualityCounts()
  for (const r of rows) {
    qualityCounts[r.sourceQuality] += 1
  }

  const blocked = rows.filter((r) => r.blockedFromImport)
  const safePreview = rows.filter((r) => r.safeForPreviewBranchImport)

  const allWarnings = rows.flatMap((r) =>
    r.importWarnings.map((w) => ({
      source_key: r.sourceSlug,
      sourceFile: r.sourceFile,
      ...w,
    })),
  )

  const recommendation =
    blocked.length > 0
      ? "Do not run a bulk Supabase seed until `needs_review` rows are corrected or explicitly accepted."
      : qualityCounts.low > 0
        ? "A preview-branch seed may be reasonable after human review of `low` quality rows."
        : "Dataset looks clean enough to plan Phase 9B preview-branch upserts with normal cautions."

  const auditSummary: PlantLibraryImportAuditSummary = {
    totalFilesFound,
    totalJsonPlantFilesParsed: jsonFiles.length,
    rowsMapped: rows.length,
    parseFailures,
    qualityCounts,
    recommendation,
    noSupabaseWrites: true,
  }

  const previewPayload = {
    generatedAt: new Date().toISOString(),
    source: "heydenberk/gardening-data",
    inputDir: path.relative(repoRoot, dir),
    rows,
    auditSummary,
    warnings: allWarnings,
  }

  fs.writeFileSync(outJson, JSON.stringify(previewPayload, null, 2), "utf8")

  const md: string[] = []
  md.push("# Heydenberk gardening-data → plant_library (Phase 9A audit)")
  md.push("")
  md.push(`Generated: ${previewPayload.generatedAt}`)
  md.push(`Input directory: \`${previewPayload.inputDir}\``)
  md.push("")
  md.push("## Contract")
  md.push("")
  md.push(
    "**No Supabase writes occurred.** This report is produced from local JSON only. No migrations, no staging tables, no service role keys, and no network calls.",
  )
  md.push("")
  md.push("## Summary counts")
  md.push("")
  md.push(`- Total files in directory (any type): **${totalFilesFound}**`)
  md.push(`- JSON plant files considered (excluding index.json): **${jsonFiles.length}**`)
  md.push(`- Rows mapped: **${rows.length}**`)
  md.push(`- Parse / mapping failures: **${parseFailures}**`)
  md.push(`- Quality — high: **${qualityCounts.high}**, medium: **${qualityCounts.medium}**, low: **${qualityCounts.low}**, needs_review: **${qualityCounts.needs_review}**`)
  md.push("")
  md.push("## Recommendation")
  md.push("")
  md.push(recommendation)
  md.push("")
  md.push("## Source tooling inspected (reference only)")
  md.push("")
  if (sourceFilesInspected.length === 0) {
    md.push("- _(none found at expected paths)_")
  } else {
    for (const f of sourceFilesInspected) {
      md.push(`- \`${f}\``)
    }
  }
  md.push("")
  md.push("## Records blocked from future import (`needs_review`)")
  md.push("")
  if (blocked.length === 0) {
    md.push("- _(none)_")
  } else {
    for (const r of blocked) {
      md.push(`- **${r.sourceSlug}** (\`${r.sourceFile}\`)`)
    }
  }
  md.push("")
  md.push("## Records marked safe for future preview-branch import (`high` or `medium`)")
  md.push("")
  if (safePreview.length === 0) {
    md.push("- _(none)_")
  } else {
    for (const r of safePreview) {
      md.push(`- **${r.sourceSlug}** — ${r.sourceQuality}`)
    }
  }
  md.push("")
  md.push("## Per-record warnings")
  md.push("")
  for (const r of rows) {
    md.push(`### ${r.sourceSlug} (\`${r.sourceFile}\`) — ${r.sourceQuality}`)
    md.push("")
    md.push("| Column | Value |")
    md.push("| --- | --- |")
    md.push(`| common_name | ${r.row.common_name} |`)
    md.push(`| scientific_name | ${r.row.scientific_name} |`)
    md.push(`| category | ${r.row.category} |`)
    md.push(`| edible | ${r.row.edible} |`)
    md.push(`| sunlight | ${r.row.sunlight ?? ""} |`)
    md.push(`| water | ${r.row.water ?? ""} |`)
    md.push(`| spacing_inches | ${r.row.spacing_inches ?? ""} |`)
    md.push(`| days_to_maturity | ${r.row.days_to_maturity ?? ""} |`)
    md.push(`| care_summary | ${r.row.care_summary} |`)
    md.push(`| watch_out_for | ${r.row.watch_out_for} |`)
    md.push("")
    if (r.importWarnings.length === 0) {
      md.push("_No warnings._")
    } else {
      for (const w of r.importWarnings) {
        md.push(`- **${String(w.code)}**: ${w.message}`)
      }
    }
    md.push("")
  }

  if (parseErrors.length > 0) {
    md.push("## Parse failures")
    md.push("")
    for (const pe of parseErrors) {
      md.push(`- \`${pe.file}\`: ${pe.message}`)
    }
    md.push("")
  }

  fs.writeFileSync(outMd, md.join("\n"), "utf8")

  process.stdout.write(`Wrote ${path.relative(repoRoot, outMd)}\n`)
  process.stdout.write(`Wrote ${path.relative(repoRoot, outJson)}\n`)
}

main()
