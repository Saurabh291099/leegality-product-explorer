import { ArrowLeft, ArrowRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange, label = 'Product pages' }) => {
  const firstPage = Math.min(Math.max(1, currentPage - 2), Math.max(1, totalPages - 4));
  const visiblePages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => firstPage + index,
  );
  const firstMobilePage = Math.min(Math.max(1, currentPage - 1), Math.max(1, totalPages - 2));
  const mobilePages = Array.from(
    { length: Math.min(3, totalPages) },
    (_, index) => firstMobilePage + index,
  );

  return (
    <nav className="flex w-full flex-nowrap items-center justify-center gap-1 sm:gap-1.5" aria-label={label}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded border border-gray-200 bg-white px-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        <span className="hidden sm:inline">Previous</span>
      </button>
      <div className="flex shrink-0 items-center gap-1 sm:hidden">
        {mobilePages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Page ${page}`}
            className={`h-9 min-w-9 rounded border px-2 text-sm ${page === currentPage ? 'border-sky-600 bg-sky-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            {page}
          </button>
        ))}
      </div>
      <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Page ${page}`}
            className={`h-9 min-w-9 rounded border px-3 text-sm ${page === currentPage ? 'border-sky-600 bg-sky-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded border border-gray-200 bg-white px-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
      >
        <span className="hidden sm:inline">Next</span>
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
};

export default Pagination;
