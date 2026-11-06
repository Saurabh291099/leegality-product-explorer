import { useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import './App.css'
import ProductDetail from './pages/ProductDetail'
import ProductListing from './pages/ProductListing'
import Navbar from './components/common/Header'

const filterParamNames = ['search', 'category', 'brand', 'minPrice', 'maxPrice', 'rating'];

const parsePrice = (value) => {
  if (value === null || value === '') {
    return null;
  }

  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : null;
};

function readFilters(searchParams) {
  return {
    search: searchParams.get('search') ?? '',
    categories: searchParams.getAll('category'),
    brands: searchParams.getAll('brand'),
    minPrice: parsePrice(searchParams.get('minPrice')),
    maxPrice: parsePrice(searchParams.get('maxPrice')),
    topRatedOnly: searchParams.get('rating') === '4',
  };
}

function writeFilters(searchParams, filters) {
  filterParamNames.forEach((name) => searchParams.delete(name));

  if (filters.search) {
    searchParams.set('search', filters.search);
  }
  filters.categories.forEach((category) => searchParams.append('category', category));
  filters.brands.forEach((brand) => searchParams.append('brand', brand));

  if (filters.minPrice !== null) {
    searchParams.set('minPrice', String(filters.minPrice));
  }
  if (filters.maxPrice !== null) {
    searchParams.set('maxPrice', String(filters.maxPrice));
  }
  if (filters.topRatedOnly) {
    searchParams.set('rating', '4');
  }

  searchParams.delete('page');
}

function App() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = readFilters(searchParams);
  const requestedPage = Number(searchParams.get('page'));
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const setPage = (nextPage) => {
    const safePage = Number.isSafeInteger(nextPage) && nextPage > 0 ? nextPage : 1;
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      if (safePage === 1) {
        nextParams.delete('page');
      } else {
        nextParams.set('page', String(safePage));
      }
      return nextParams;
    }, { replace: true });
  };

  const updateFilters = (nextFilters) => {
    const updatedFilters = {
      ...filters,
      ...(typeof nextFilters === 'function' ? nextFilters(filters) : nextFilters),
    };

    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      writeFilters(nextParams, updatedFilters);
      return nextParams;
    }, { replace: true });
  };

  const returnToListing = (openFilters = false) => {
    if (openFilters) {
      setFiltersOpen(true);
    }
    navigate({ pathname: '/', search: location.search });
  };

  const handleMenuClick = () => {
    if (location.pathname.startsWith('/product/')) {
      returnToListing(true);
      return;
    }

    setFiltersOpen((open) => !open);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full overflow-clip rounded-xl bg-white shadow-lg">
        <Navbar
          searchValue={filters.search}
          onSearchChange={(search) => updateFilters({ search })}
          onMenuClick={handleMenuClick}
          filtersOpen={location.pathname === '/' && filtersOpen}
        />
        <Routes>
          <Route  
            path="/"
            element={(
              <ProductListing
                filters={filters}
                onFiltersChange={updateFilters}
                onResetFilters={() => updateFilters({
                  search: '',
                  categories: [],
                  brands: [],
                  minPrice: null,
                  maxPrice: null,
                  topRatedOnly: false,
                })}
                isFilterOpen={filtersOpen}
                onOpenFilters={() => setFiltersOpen(true)}
                onCloseFilters={() => setFiltersOpen(false)}
                page={page}
                onPageChange={setPage}
              />
            )}
          />
          <Route
            path="/product/:id"
            element={<ProductDetail key={location.pathname} onBack={() => returnToListing()} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
