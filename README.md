# Leegality Product Explorer

A responsive product listing and detail experience built with React, Vite, Tailwind CSS, and React Router using DummyJSON.

## Run locally

```sh
npm install
npm run dev
```

Use `npm run lint` and `npm run build` to validate the project.

## Features

- Loads the full product catalog and dynamic categories from DummyJSON.
- Uses category endpoints when category checkboxes are selected.
- Combines search, category, brand, price, and rating filters.
- Paginates filtered results with eight products per page.
- Loads product details by ID and keeps listing filters/page state when returning.
- Includes loading, request error, retry, and empty-result states.

## Architecture and assumptions

- `src/service/productApi.js` owns API requests and HTTP error handling.
- `ProductListing` applies client-side search, brand, price, and rating filters; selected categories are fetched from the category endpoint.
- Pagination is client-side after filtering. DummyJSON supports `limit=0`, which returns all 194 current products.
- Category options come from `/products/categories`; brand options are unique non-empty brands in the loaded catalog.
- Listing filters and page are kept in the app shell, so navigating to a product and back does not discard them.

## Further improvements

- Persist filters in the URL so they survive reloads and can be shared.
- Add automated component and browser tests for filtering, pagination, and navigation.
- Replace the demo cart, history, and profile controls with application flows.