
import {
  Menu,
  Search,
  ShoppingCart,
  History,
  UserRound,
} from "lucide-react";

const Navbar = ({
  searchValue = '',
  onSearchChange = () => {},
  onMenuClick = () => {},
  filtersOpen = false,
  cartCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-15 w-full items-center justify-between gap-3 bg-slate-700 px-3 text-white shadow-sm sm:gap-5 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label={filtersOpen ? "Close filters" : "Open filters"}
        aria-expanded={filtersOpen}
        aria-controls="product-filter-sidebar"
        className="shrink-0 rounded-md p-2 text-slate-200 transition cursor-pointer hover:bg-slate-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Menu size={25} strokeWidth={2.5} />
      </button>

      <label className="flex h-10 min-w-0 w-full max-w-155 flex-1 items-center gap-3 rounded-lg border border-gray-200 bg-white px-3">
        <Search size={20} className="shrink-0 text-gray-500" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search products..."
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search products"
          className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />
      </label>

      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        <button
          type="button"
          aria-label="Shopping cart"
          title="Shopping cart"
          className="relative rounded-md p-2 text-slate-200 transition hover:bg-slate-600 hover:text-white"
        >
          <ShoppingCart size={23} />
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {cartCount}
            </span>
          )}
        </button>

        <button
          type="button"
          aria-label="Order history"
          title="Order history"
          className="hidden rounded-md p-2 text-slate-200 transition hover:bg-slate-600 hover:text-white sm:inline-flex"
        >
          <History size={23} />
        </button>

        <button
          type="button"
          aria-label="User profile"
          title="User profile"
          className="rounded-md p-2 text-slate-200 transition hover:bg-slate-600 hover:text-white"
        >
          <UserRound size={23} />
        </button>

      </div>
    </header>
  );
};

export default Navbar;
