import React from 'react'
import { Button } from '@/shared/ui/button'

interface ArticlePaginationProps {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  onPageChange: (page: number) => void
}

export function ArticlePagination({ 
  currentPage, 
  totalPages, 
  hasNextPage, 
  hasPrevPage, 
  onPageChange 
}: ArticlePaginationProps) {
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) return null

  // Generate visible page numbers (show up to 5 pages around current)
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <nav 
      className="flex items-center justify-center gap-1 py-8" 
      role="navigation" 
      aria-label="Article pagination"
    >
      {/* Previous button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className="mr-2"
        aria-label="Go to previous page"
      >
        Previous
      </Button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-sm text-neutral-500" aria-hidden="true">
                ...
              </span>
            ) : (
              <Button
                variant={currentPage === page ? 'primary' : 'outline'}
                size="sm"
                onClick={() => typeof page === 'number' && onPageChange(page)}
                className={[
                  'min-w-[2.5rem]',
                  currentPage === page 
                    ? 'bg-black text-white hover:bg-black/90' 
                    : 'hover:bg-neutral-50'
                ].join(' ')}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="ml-2"
        aria-label="Go to next page"
      >
        Next
      </Button>
    </nav>
  )
}

export default ArticlePagination
