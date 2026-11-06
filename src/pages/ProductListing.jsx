import { useEffect, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import ErrorMessage from '../components/common/Error';
import Loader from '../components/common/Loader';
import ProductFilter from '../components/filters/ProductFilter';
import Pagination from '../components/products/Pagination';
import ProductGrid from '../components/products/ProductGrid';
import { getCategories, getProducts, getProductsByCategory } from '../service/productApi';

const PAGE_SIZE = 8;

function ProductListing({
  filters,
  onFiltersChange,
  onResetFilters,
  isFilterOpen,
  onOpenFilters,
  onCloseFilters,
  page,
  onPageChange,
}) {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(null);
  const [categoryResult, setCategoryResult] = useState({ key: '', products: [] });
  const [categoryError, setCategoryError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      getProducts(controller.signal),
      getCategories(controller.signal),
    ])
      .then(([productResponse, categoryResponse]) => {
        setAllProducts(productResponse.products ?? []);
        setCategories(categoryResponse);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setCatalogError(error.message || 'Unable to load the product catalog.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCatalogLoading(false);
        }
      });

    return () => controller.abort();
  }, [retryCount]);

  const selectedCategoryKey = filters.categories.slice().sort().join('|');
  const categoryRequestKey = `${retryCount}:${selectedCategoryKey}`;

  useEffect(() => {
    if (!selectedCategoryKey) {
      return undefined;
    }

    const controller = new AbortController();

    Promise.all(
      filters.categories.map((category) => getProductsByCategory(category, controller.signal)),
    )
      .then((responses) => {
        const products = responses.flatMap((response) => response.products ?? []);
        const uniqueProducts = [...new Map(products.map((product) => [product.id, product])).values()];
        setCategoryResult({ key: categoryRequestKey, products: uniqueProducts });
        setCategoryError(null);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setCategoryError({ key: categoryRequestKey, message: error.message });
        }
      });

    return () => controller.abort();
  }, [filters.categories, selectedCategoryKey, categoryRequestKey]);

  const retry = () => {
    setCatalogLoading(true);
    setCatalogError(null);
    setCategoryError(null);
    setRetryCount((count) => count + 1);
  };

  const brands = [...new Set(allProducts.map((product) => product.brand).filter(Boolean))].sort();
  const categoryLoading = Boolean(
    selectedCategoryKey &&
    categoryResult.key !== categoryRequestKey &&
    categoryError?.key !== categoryRequestKey,
  );
  const categoryProducts = selectedCategoryKey
    ? categoryResult.key === categoryRequestKey ? categoryResult.products : []
    : allProducts;
  const searchText = filters.search.trim().toLowerCase();
  const filteredProducts = categoryProducts.filter((product) => {
    const matchesSearch = !searchText || [product.title, product.brand, product.category]
      .some((value) => value?.toLowerCase().includes(searchText));
    const matchesBrand = filters.brands.length === 0 || filters.brands.includes(product.brand);
    const matchesMinPrice = filters.minPrice === null || product.price >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === null || product.price <= filters.maxPrice;
    const matchesRating = !filters.topRatedOnly || product.rating >= 4;

    return matchesSearch && matchesBrand && matchesMinPrice && matchesMaxPrice && matchesRating;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const visibleError = catalogError || (
    categoryError?.key === categoryRequestKey ? categoryError.message : null
  );

  const handleFiltersChange = (nextFilters) => {
    setCategoryError(null);
    onFiltersChange(nextFilters);
  };

  return (
    <main className={`grid min-h-[calc(100vh-3.75rem)] ${isFilterOpen ? 'md:grid-cols-[270px_minmax(0,1fr)]' : 'md:grid-cols-1'}`}>
      {isFilterOpen && (
        <>
          <button
            type="button"
            onClick={onCloseFilters}
            aria-label="Close filters"
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
          />
          <aside
            id="product-filter-sidebar"
            aria-label="Product filters"
            className="fixed inset-y-0 left-0 z-50 h-full w-[min(88vw,300px)] overflow-y-auto border-r border-gray-200 bg-white shadow-xl md:sticky md:top-[60px] md:z-10 md:h-[calc(100vh-60px)] md:w-auto md:shadow-none"
          >
            <ProductFilter
              categories={categories}
              brands={brands}
              filters={filters}
              categoriesLoading={catalogLoading}
              onFiltersChange={handleFiltersChange}
              onApplyPrice={handleFiltersChange}
              onReset={onResetFilters}
              onClose={onCloseFilters}
            />
          </aside>
        </>
      )}

      <section className="min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={isFilterOpen ? onCloseFilters : onOpenFilters}
            aria-expanded={isFilterOpen}
            aria-controls="product-filter-sidebar"
            className="flex cursor-pointer items-center gap-2 rounded-md text-lg font-semibold text-gray-900 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
          >
            <SlidersHorizontal size={20} className="text-gray-600" aria-hidden="true" />
            Filters
          </button>
          <p className="text-sm text-gray-500" aria-live="polite">
            {filteredProducts.length} products
          </p>
        </div>

        {catalogLoading && allProducts.length === 0 ? (
          <Loader />
        ) : visibleError ? (
          <ErrorMessage message={visibleError} onRetry={retry} />
        ) : categoryLoading ? (
          <Loader label="Updating products..." />
        ) : filteredProducts.length > 0 ? (
          <>
            <ProductGrid productData={pageProducts} />
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-4 text-center" role="status">
            <h2 className="text-lg font-semibold text-gray-900">No products found</h2>
            <p className="max-w-md text-sm text-gray-600">
              {searchText
                ? `No products match "${filters.search}". Try another search or clear your filters.`
                : 'No products match your selected filters. Try adjusting them or clear all filters.'}
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear search and filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default ProductListing;