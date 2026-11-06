import { useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import ProductDetail from './pages/ProductDetail'
import ProductListing from './pages/ProductListing'
import Navbar from './components/common/Header'

const initialFilters = {
  search: '',
  categories: [],
  brands: [],
  minPrice: null,
  maxPrice: null,
  topRatedOnly: false,
};

function App() {
  const [filters, setFilters] = useState(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  const updateFilters = (nextFilters) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      ...(typeof nextFilters === 'function' ? nextFilters(currentFilters) : nextFilters),
    }));
    setPage(1);
  };

  const returnToListing = (openFilters = false) => {
    if (openFilters) {
      setFiltersOpen(true);
    }
    navigate('/');
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
                onResetFilters={() => updateFilters(initialFilters)}
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
