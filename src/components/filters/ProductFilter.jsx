import { useState } from 'react';
import { Search, X } from 'lucide-react';

const ProductFilter = ({
  categories,
  brands,
  filters,
  categoriesLoading,
  onFiltersChange,
  onApplyPrice,
  onReset,
  onClose,
}) => {
  const [minPrice, setMinPrice] = useState(filters.minPrice ?? '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice ?? '');
  const [priceError, setPriceError] = useState('');

  const toggleSelection = (filterName, value, checked) => {
    const currentValues = filters[filterName];
    const nextValues = checked
      ? [...currentValues, value]
      : currentValues.filter((item) => item !== value);

    onFiltersChange({ ...filters, [filterName]: nextValues });
  };

  const applyPriceRange = () => {
    const nextMinPrice = minPrice === '' ? null : Number(minPrice);
    const nextMaxPrice = maxPrice === '' ? null : Number(maxPrice);

    if (
      (nextMinPrice !== null && (!Number.isFinite(nextMinPrice) || nextMinPrice < 0)) ||
      (nextMaxPrice !== null && (!Number.isFinite(nextMaxPrice) || nextMaxPrice < 0))
    ) {
      setPriceError('Enter valid prices greater than or equal to zero.');
      return;
    }

    if (nextMinPrice !== null && nextMaxPrice !== null && nextMinPrice > nextMaxPrice) {
      setPriceError('Minimum price must be less than or equal to maximum price.');
      return;
    }

    setPriceError('');
    onApplyPrice({ ...filters, minPrice: nextMinPrice, maxPrice: nextMaxPrice });
  };
  return (
    <div className="flex flex-col gap-6 p-5 sm:p-6">
      <div className="flex items-center justify-between md:hidden">
        <h2 className="font-semibold text-gray-900">Filters</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <label className="relative block">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <span className="sr-only">Search products</span>
        <input
          type="search"
          value={filters.search}
          onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
          placeholder="Search..."
          className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
      </label>

      <fieldset className="flex max-h-64 flex-col gap-3 overflow-y-auto border-t border-gray-200 pt-4 pr-2">
        <legend className="mb-1 font-semibold text-gray-900">Categories</legend>
        {categoriesLoading && <p className="text-sm text-gray-500">Loading categories...</p>}
        {!categoriesLoading && categories.map((category) => (
          <label key={category.slug} className="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={filters.categories.includes(category.slug)}
              onChange={(event) => toggleSelection('categories', category.slug, event.target.checked)}
              className="size-4 accent-sky-600"
            />
            <span>{category.name}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-3 border-t border-gray-200 pt-4">
        <legend className="mb-1 font-semibold text-gray-900">Price range</legend>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-sm text-gray-600" htmlFor="minPrice">
            <span className="sr-only">Minimum price</span>
            <input
              id="minPrice"
              name="minPrice"
              type="number"
              min="0"
              step="0.01"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="Min"
              className="h-10 w-full rounded-md border border-gray-300 px-3 text-gray-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>
          <label className="text-sm text-gray-600" htmlFor="maxPrice">
            <span className="sr-only">Maximum price</span>
            <input
              id="maxPrice"
              name="maxPrice"
              type="number"
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Max"
              className="h-10 w-full rounded-md border border-gray-300 px-3 text-gray-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>
        </div>
        {priceError && <p className="text-sm text-red-600" role="alert">{priceError}</p>}
        <button
          type="button"
          onClick={applyPriceRange}
          className="h-10 rounded-md bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-700"
        >
          Apply
        </button>
      </fieldset>

      <fieldset className="flex max-h-56 flex-col gap-3 overflow-y-auto border-t border-gray-200 pt-4 pr-2">
        <legend className="mb-1 font-semibold text-gray-900">Brands</legend>
        {brands.map((brand) => (
          <label key={brand} className="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={filters.brands.includes(brand)}
              onChange={(event) => toggleSelection('brands', brand, event.target.checked)}
              className="size-4 accent-sky-600"
            />
            <span>{brand}</span>
          </label>
        ))}
        {brands.length === 0 && <p className="text-sm text-gray-500">Brands will appear when products load.</p>}
      </fieldset>

      <fieldset className="flex flex-col gap-3 border-t border-gray-200 pt-4">
        <legend className="mb-1 font-semibold text-gray-900">Rating</legend>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={filters.topRatedOnly}
            onChange={(event) => onFiltersChange({ ...filters, topRatedOnly: event.target.checked })}
            className="size-4 accent-sky-600"
          />
          <span>4 stars and up</span>
        </label>
      </fieldset>

      <button
        type="button"
        onClick={() => {
          setMinPrice('');
          setMaxPrice('');
          setPriceError('');
          onReset();
        }}
        className="self-start text-sm font-medium text-sky-700 underline-offset-4 hover:underline"
      >
        Clear all filters
      </button>
    </div>
  );
};

export default ProductFilter;