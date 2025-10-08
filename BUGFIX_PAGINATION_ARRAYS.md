# Bug Fix: Pagination Arrays in Admin Response

## Issue
The admin advertisement requests page was showing a Zod validation error when loading:
```
"Invalid input: expected string, received array"
"Invalid input: expected number, received array"
```

The API was returning all pagination fields as arrays instead of single values:
```json
{
  "links": {
    "first": ["url", "url"],
    "last": ["url", "url"],
    "prev": [null, null],
    "next": [null, null]
  },
  "meta": {
    "current_page": [1, 1],
    "from": [1, 1],
    "to": [2, 2],
    "per_page": [20, 20],
    "total": [2, 2],
    "last_page": [1, 1]
  }
}
```

## Root Cause
This is a backend bug where pagination values are being duplicated as arrays. However, we need to handle this gracefully on the frontend to prevent the application from breaking.

## Solution

### 1. Created Normalization Helpers
**File:** `src/features/admin/advertisement-requests/schemas/admin-advertisement-request.ts`

Added helper functions to extract single values from arrays:

```typescript
// Generic normalizer for arrays
const normalizeValue = <T>(val: T | T[]): T => 
  (Array.isArray(val) ? val[0] : val)

// Specialized normalizer for nullable strings (handles [null, null])
const normalizeNullableString = (
  val: string | (string | null)[] | null | undefined
): string | null => {
  if (val === null || val === undefined) return null
  if (Array.isArray(val)) {
    const firstNonNull = val.find((v) => v !== null)
    return firstNonNull ?? null
  }
  return val
}
```

### 2. Updated PaginationLinks Schema
Now accepts both single values and arrays, then normalizes them:

```typescript
export const PaginationLinks = z
  .object({
    first: z.union([z.string(), z.array(z.string().nullable())]).nullable().optional(),
    last: z.union([z.string(), z.array(z.string().nullable())]).nullable().optional(),
    prev: z.union([z.string(), z.array(z.string().nullable())]).nullable().optional(),
    next: z.union([z.string(), z.array(z.string().nullable())]).nullable().optional(),
  })
  .transform((links) => ({
    first: normalizeNullableString(links.first),
    last: normalizeNullableString(links.last),
    prev: normalizeNullableString(links.prev),
    next: normalizeNullableString(links.next),
  }))
```

### 3. Updated PaginationMeta Schema
Handles both single numbers and arrays of numbers:

```typescript
export const PaginationMeta = z
  .object({
    current_page: z.union([z.number().int().min(1), z.array(z.number().int().min(1))]),
    per_page: z.union([z.number().int().min(1), z.array(z.number().int().min(1))]),
    total: z.union([z.number().int().nonnegative(), z.array(z.number().int().nonnegative())]),
    last_page: z.union([z.number().int().min(1), z.array(z.number().int().min(1))]),
    has_more: z.boolean(),
    from: z.union([z.number().int(), z.array(z.number().int())]).optional(),
    to: z.union([z.number().int(), z.array(z.number().int())]).optional(),
  })
  .transform((meta) => ({
    current_page: normalizeValue(meta.current_page),
    per_page: normalizeValue(meta.per_page),
    total: normalizeValue(meta.total),
    last_page: normalizeValue(meta.last_page),
    has_more: meta.has_more,
    from: meta.from ? normalizeValue(meta.from) : undefined,
    to: meta.to ? normalizeValue(meta.to) : undefined,
  }))
```

### 4. Added Better Error Logging
**File:** `src/features/admin/advertisement-requests/api/get-requests.ts`

Added `safeParse()` with detailed error logging:

```typescript
const parsed = AdminAdvertisementRequestListResponse.safeParse(data)

if (!parsed.success) {
  console.error('Failed to parse admin advertisement requests response:', parsed.error)
  console.error('Raw data:', data)
  throw new Error('Failed to parse response from server')
}
```

## How It Works

1. **Schema accepts both formats**: Single values OR arrays
2. **Transform normalizes data**: Extracts first element from arrays
3. **Handles null arrays**: `[null, null]` becomes `null`
4. **Type-safe output**: Rest of the app sees normalized data

## Example Transformation

**Input (from API):**
```json
{
  "current_page": [1, 1],
  "total": [2, 2],
  "prev": [null, null],
  "next": [null, null]
}
```

**Output (after schema transform):**
```json
{
  "current_page": 1,
  "total": 2,
  "prev": null,
  "next": null
}
```

## Testing
✅ All TypeScript type checks pass
✅ Admin page loads successfully with paginated data
✅ Pagination controls work correctly
✅ Handles both array and single value formats
✅ Gracefully handles arrays of null values

## Result
The admin advertisement requests page now loads successfully and displays paginated data correctly, despite the backend bug.

## Recommendation
While this fix allows the frontend to work, the **backend should be fixed** to return single values instead of arrays. This frontend fix is defensive programming to handle the issue gracefully until the backend is corrected.
