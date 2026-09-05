import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Pagination = ({
  page,
  totalPages,
  onPageChange,
}) => {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const pages = [];

  for (let i = 1; i <= totalPages; i += 1) {
    pages.push(i);
  }

  return (
    <div className="pagination">

      <button
        type="button"
        disabled={page === 1}
        onClick={() =>
          onPageChange(page - 1)
        }
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="pagination-pages">
        {pages.map((pageNumber) => (
          <button
            type="button"
            key={pageNumber}
            className={
              pageNumber === page
                ? "active"
                : ""
            }
            onClick={() =>
              onPageChange(pageNumber)
            }
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() =>
          onPageChange(page + 1)
        }
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>

    </div>
  );
};

export default Pagination;