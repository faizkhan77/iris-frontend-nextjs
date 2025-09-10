import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// A utility function for conditional class names, similar to `cn` in shadcn/ui.
// You can replace this with your own utility or install the `clsx` library.
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Custom hook to generate the range of page numbers to display,
 * including ellipsis for condensed view.
 */
const usePagination = ({ totalPages, currentPage, siblings = 1 }: { totalPages: number, currentPage: number, siblings?: number }) => {
  const paginationRange = React.useMemo(() => {
    const totalPageNumbers = siblings * 2 + 3 + 2; // siblings + first/last + currentPage + 2*ellipsis

    // Case 1: Not enough pages to bother breaking it up
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblings, 1);
    const rightSiblingIndex = Math.min(currentPage + siblings, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // Case 2: No left dots to show, but right dots needed
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblings;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    // Case 3: No right dots to show, but left dots needed
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblings;
      const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + 1 + i);
      return [1, '...', ...rightRange];
    }

    // Case 4: Both left and right dots needed
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
      return [1, '...', ...middleRange, '...', totalPages];
    }

    return []; // Should be unreachable
  }, [totalPages, currentPage, siblings]);

  return paginationRange;
};

interface PaginationProps {
  /** The current active page */
  currentPage: number;
  /** The total number of pages */
  totalPages: number;
  /** A callback function invoked with the new page number when the page changes */
  onPageChange: (page: number) => void;
  /** Optional class name for the container to allow for custom styling */
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const paginationRange = usePagination({ totalPages, currentPage });

  if (currentPage === 0 || totalPages < 2) {
    return null; // Don't render pagination if there's only one page
  }

  const onNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const onPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center space-x-2', className)}
    >
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className={cn(
          'inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 transition-colors',
          'hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed',
          'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous</span>
      </button>

      {/* Page Numbers */}
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === '...') {
          return (
            <span
              key={`dots-${index}`}
              className="flex items-center justify-center h-9 w-9 text-sm text-gray-500 dark:text-gray-400"
            >
              &#8230;
            </span>
          );
        }

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber as number)}
            className={cn(
              'inline-flex items-center justify-center h-9 w-9 rounded-md border text-sm font-medium transition-colors',
              pageNumber === currentPage
                ? 'bg-blue-600 border-blue-600 text-white cursor-default' // Active page
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={currentPage === lastPage}
        className={cn(
          'inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 transition-colors',
          'hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed',
          'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
        )}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next</span>
      </button>
    </nav>
  );
}