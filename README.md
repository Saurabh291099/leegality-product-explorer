# Leegality Product Explorer

I built this small product explorer as part of the Leegality frontend assessment. It uses DummyJSON to show a product catalogue, let people narrow it down, and open a separate page for each product.

## Run it locally

```sh
npm install
npm run dev
```

To check the project, run `npm run lint` and `npm run build`.

## What I built

The listing page has a responsive product grid and a filter sidebar. Search, category, brand, price, and rating filters work together. Categories come from DummyJSON, while the brand list is built from the products returned by the API. Product cards open `/product/:id`, where the app fetches and displays that product's details and images.

I added pagination to both the product list and the detail-page image gallery. The current filters and page are kept in the URL, so refreshing the listing or returning from a product does not lose that state. The pages also show a loading state while data is being fetched, and provide an error/retry message or an empty-results message when needed.

## A few implementation decisions

- I load the full catalogue with `limit=0`, then filter and paginate it in the browser. That keeps filters working together without extra requests for each price, brand, or search change.
- When a category is selected, I use DummyJSON's category endpoint. Category labels come from `/products/categories` rather than a hard-coded list.
- I keep API calls in `src/service/productApi.js` so the pages do not need to know how HTTP errors are handled.
- I use React Router for the listing and detail routes, and URL query parameters for the listing filters and page number.

## If I had more time

I would add automated tests for filter combinations, pagination, refreshes, and back navigation. I would also replace the header's demo cart, history, and profile buttons with working flows.