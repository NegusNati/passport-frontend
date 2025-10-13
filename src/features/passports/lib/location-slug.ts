const NON_ALNUM = /[^a-z0-9]+/g
const TRIM_DASH = /^-+|-+$/g

function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(NON_ALNUM, '-')
    .replace(TRIM_DASH, '')
}

export function toLocationSlug(location: string) {
  return normalize(location)
}

export function matchLocationFromSlug(slug: string, locations: readonly string[]) {
  const normalized = normalize(slug)
  return locations.find((candidate) => normalize(candidate) === normalized)
}
