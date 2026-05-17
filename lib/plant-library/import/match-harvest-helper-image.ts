/**
 * Image matching for Harvest Helper vegetable photos.
 *
 * Naming convention: `{zero_padded_id}_{plant_name}.{ext}`
 * Examples: 01_tomato.jpg, 08_Broccoli.jpg, 17_eggplant.JPG
 *
 * Rules:
 * - Match by numeric ID prefix (1 → "01", 2 → "02", etc.)
 * - Extension matching is case-insensitive (.jpg, .JPG, .jpeg, .png, .webp)
 * - Returns null if no match found
 * - Returns the first match if multiple exist (should not happen in clean data)
 */

const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"])

/**
 * Build a lookup map from plant ID → photo filename.
 *
 * @param photoFilenames - list of filenames in the vegetable_photos directory
 */
export function buildImageIndex(
  photoFilenames: string[],
): Map<number, string> {
  const index = new Map<number, string>()

  for (const filename of photoFilenames) {
    const ext = extname(filename).toLowerCase()
    if (!SUPPORTED_EXTENSIONS.has(ext)) continue

    const match = filename.match(/^(\d+)_/)
    if (!match) continue

    const id = parseInt(match[1], 10)
    if (isNaN(id)) continue

    // Only store first match per ID (duplicates should not occur)
    if (!index.has(id)) {
      index.set(id, filename)
    }
  }

  return index
}

/**
 * Look up a matching photo filename for a given plant ID.
 *
 * @param id - numeric plant ID from CSV (1-based)
 * @param imageIndex - pre-built map from buildImageIndex
 * @returns filename string (e.g. "01_tomato.jpg") or null
 */
export function matchHarvestHelperImage(
  id: number,
  imageIndex: Map<number, string>,
): string | null {
  return imageIndex.get(id) ?? null
}

/**
 * Simple cross-platform extname that handles uppercase extensions.
 */
function extname(filename: string): string {
  const dot = filename.lastIndexOf(".")
  if (dot < 0 || dot === filename.length - 1) return ""
  return filename.slice(dot)
}
