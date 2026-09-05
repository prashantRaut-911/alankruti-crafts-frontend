import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import ProductGrid from "../components/ProductGrid";
import SearchBar from "../components/SearchBar";
import SortDropdown from "../components/SortDropdown";
import Pagination from "../components/Pagination";
import ErrorMessage from "../components/ErrorMessage";

import { useProducts } from "../hooks/useProducts";

const Products = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const categories = [
    "All",
    "Handmade",
    "Decor",
    "Gifts",
  ];

  const params = useMemo(
    () => ({
      search: search.trim(),
      category,
      sort,
      page,
      limit: 12,
    }),
    [search, category, sort, page]
  );

  const {
    products,
    pagination,
    loading,
    error,
    refetch,
  } = useProducts(params);

  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  const handleCategoryChange = (value) => {
    setCategory(value === "All" ? "" : value);
    setMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="products-page">

      {/* ================= PAGE HEADER ================= */}
      <section className="page-header">
        <div className="container">

          <span className="section-kicker">
            The collection
          </span>

          <h1>
            Crafted for your space.
          </h1>

          <p>
            Explore our collection of thoughtful
            handmade products, decor and gifts.
          </p>

        </div>
      </section>

      {/* ================= SHOP ================= */}
      <section className="shop-section section">
        <div className="container">

          {/* Search + Mobile Filter */}
          <div className="shop-toolbar">

            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search products..."
            />

            <button
              type="button"
              className="mobile-filter-button"
              onClick={() =>
                setMobileFiltersOpen(true)
              }
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>

          </div>

          <div className="shop-layout">

            {/* ================= SIDEBAR ================= */}
            <aside
              className={`shop-sidebar ${
                mobileFiltersOpen
                  ? "mobile-open"
                  : ""
              }`}
            >

              <div className="sidebar-header">
                <h3>Filters</h3>

                <button
                  type="button"
                  onClick={() =>
                    setMobileFiltersOpen(false)
                  }
                  className="sidebar-close"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="filter-section">

                <div className="filter-title">
                  Category
                </div>

                <div className="category-filter">

                  {categories.map(
                    (categoryName) => {
                      const active =
                        categoryName === "All"
                          ? category === ""
                          : category ===
                            categoryName;

                      return (
                        <button
                          type="button"
                          key={categoryName}
                          className={
                            active
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            handleCategoryChange(
                              categoryName
                            )
                          }
                        >
                          {categoryName}
                        </button>
                      );
                    }
                  )}

                </div>
              </div>

              <div className="filter-section">

                <div className="filter-title">
                  Sort
                </div>

                <SortDropdown
                  value={sort}
                  onChange={setSort}
                />

              </div>

              <button
                type="button"
                className="clear-filters"
                onClick={clearFilters}
              >
                Clear all filters
              </button>

            </aside>

            {/* Mobile overlay */}
            {mobileFiltersOpen && (
              <div
                className="filter-overlay"
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
              />
            )}

            {/* ================= PRODUCTS ================= */}
            <div className="shop-results">

              <div className="results-header">

                <div>
                  <span className="results-count">
                    {pagination.total || 0} products
                  </span>

                  {category && (
                    <span className="active-filter">
                      {category}
                    </span>
                  )}
                </div>

                <div className="desktop-sort">
                  <SortDropdown
                    value={sort}
                    onChange={setSort}
                  />
                </div>

              </div>

              {error ? (
                <ErrorMessage
                  message={error}
                  onRetry={refetch}
                />
              ) : (
                <ProductGrid
                  products={products}
                  loading={loading}
                  emptyMessage="Try changing your search or filters."
                />
              )}

              {!loading && !error && (
                <Pagination
                  page={pagination.page || page}
                  totalPages={pagination.pages || 1}
                  onPageChange={setPage}
                />
              )}

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;