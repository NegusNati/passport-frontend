# Advertisement Requests Table Refactor

## Overview

Refactored the advertisement requests table to use the reusable `DataTable` component, following the same pattern as the articles table implementation.

## Changes Made

### 1. New Table Component

**File:** `src/features/admin/advertisement-requests/components/AdminRequestsTable.tsx`

**Features:**

- Uses TanStack Table for column definitions
- Leverages the shared `DataTable` component
- Column-based table with proper type definitions
- Actions column with View and Delete buttons
- Integrated detail dialog
- Proper pagination integration

**Columns:**

- ID
- Full Name (with email as secondary text)
- Company
- Phone
- Status (with color-coded badges)
- Created Date
- Actions (View, Delete)

### 2. New Filters Component with Debounced Search

**File:** `src/features/admin/advertisement-requests/components/AdminRequestsFilters.tsx`

**Features:**

- **Debounced search inputs** (350ms delay) for:
  - Full Name
  - Company Name
  - Phone Number
- **Immediate filter** for Status dropdown
- Local state for immediate UI feedback
- Syncs with URL parameters via route navigation
- Prevents excessive API calls during typing

**How Debouncing Works:**

```typescript
// Local state for immediate UI updates
const [fullNameInput, setFullNameInput] = useState(filters.full_name ?? '')

// Debounced value (triggers API call after 350ms of no typing)
const debouncedFullName = useDebouncedValue(fullNameInput, 350)

// Only trigger filter change when debounced value changes
useEffect(() => {
  if (debouncedFullName !== filters.full_name) {
    onFilterChange({ full_name: debouncedFullName || undefined })
  }
}, [debouncedFullName])
```

### 3. Updated Route

**File:** `src/routes/admin/advertisement-requests.index.tsx`

**Changes:**

- Removed custom pagination logic (now handled by DataTable)
- Added `handlePageSizeChange` for per-page selection
- Simplified component - DataTable handles loading states
- Cleaner integration with filters

### 4. Removed Files

- Old `AdminRequestsTable.tsx` (custom implementation)
- Old `AdminRequestsFilters.tsx` (without debouncing)

## Benefits

### 1. Consistency

- Follows the same pattern as `ArticlesTable`
- Uses the same `DataTable` component
- Consistent UX across admin pages

### 2. Built-in Features

- ✅ Pagination controls (previous, next, page numbers)
- ✅ Page size selector (10, 20, 50, 100)
- ✅ Loading skeletons
- ✅ Error states
- ✅ Empty states
- ✅ Column sorting (future enhancement)
- ✅ Column visibility toggle (future enhancement)

### 3. Performance

- **Debounced search** - Reduces API calls by 90%+
  - Without debounce: 10 characters typed = 10 API calls
  - With debounce: 10 characters typed = 1 API call (after 350ms)
- Server-side pagination
- Efficient re-renders with React Table memoization

### 4. Better UX

- Immediate visual feedback when typing (local state)
- Smooth transitions with `keepPreviousData`
- Professional table controls
- Responsive design

### 5. Maintainability

- Shared component reduces code duplication
- Easier to add new features (sorting, filtering)
- Type-safe column definitions
- Consistent patterns across the codebase

## Usage

### Filters with Debounced Search

```tsx
// User types "John" in Full Name input
// 1. Local state updates immediately: "J" -> "Jo" -> "Joh" -> "John"
// 2. UI shows typed text instantly
// 3. After 350ms of no typing, debounced value updates
// 4. Single API call with full_name="John"
```

### Pagination

```tsx
// Users can:
- Click previous/next buttons
- Select page size (10, 20, 50, 100)
- Jump to specific page
- See current page and total pages
```

### Actions

```tsx
// Each row has:
- View button: Opens detail dialog
- Delete button: Confirms and deletes
```

## Testing Checklist

✅ Typing in search fields doesn't trigger immediate API calls  
✅ Search filters after 350ms of no typing  
✅ Status dropdown filters immediately  
✅ Page size changes reset to page 1  
✅ Pagination controls work correctly  
✅ Loading skeleton shows during fetches  
✅ Empty state shows when no results  
✅ Error state shows on API failure  
✅ View button opens detail dialog  
✅ Delete button shows confirmation  
✅ All TypeScript checks pass

## Performance Metrics

### API Call Reduction

**Before (no debouncing):**

- User types "John Doe" = 8 characters = 8 API calls

**After (with debouncing):**

- User types "John Doe" = 1 API call (after 350ms)
- **87.5% reduction in API calls**

### User Experience

- Local state updates: **Instant** (0ms)
- API call trigger: **350ms** after typing stops
- Smooth pagination transitions with previous data

## File Structure

```
src/features/admin/advertisement-requests/
├── components/
│   ├── AdminRequestsTable.tsx          ✅ NEW (uses DataTable)
│   ├── AdminRequestsFilters.tsx        ✅ NEW (with debouncing)
│   ├── AdminRequestDetailDialog.tsx    ✓ (unchanged)
│   └── AdminRequestStatusBadge.tsx     ✓ (unchanged)
├── api/
│   └── ... (unchanged)
└── schemas/
    └── ... (unchanged)
```

## Related Patterns

This implementation follows the same patterns as:

- `src/features/admin/articles/components/ArticlesTable.tsx`
- `src/features/admin/articles/components/ArticlesFilters.tsx`

## Future Enhancements

Potential improvements enabled by DataTable:

1. **Column Sorting**
   - Click column headers to sort
   - Server-side sorting support

2. **Column Visibility**
   - Toggle which columns to show/hide
   - Persist preferences

3. **Bulk Actions**
   - Select multiple rows
   - Bulk approve/reject

4. **Export**
   - Export filtered results to CSV
   - Download all requests

5. **Advanced Filters**
   - Date range picker for created_at
   - Multiple status selection
   - Saved filter presets

## Conclusion

The refactor successfully standardizes the advertisement requests table with the rest of the admin interface while adding significant performance improvements through debounced search. The component is now more maintainable, feature-rich, and provides a better user experience.
