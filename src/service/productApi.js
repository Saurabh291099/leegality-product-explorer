const API_BASE_URL = 'https://dummyjson.com';

async function request(path, signal) {
	const response = await fetch(`${API_BASE_URL}${path}`, signal ? { signal } : undefined);

	if (!response.ok) {
		throw new Error(`Request failed (${response.status})`);
	}

	return response.json();
}

export function getProducts(signal) {
	return request('/products?limit=0', signal);
}

export function getCategories(signal) {
	return request('/products/categories', signal);
}

export function getProductsByCategory(category, signal) {
	return request(`/products/category/${encodeURIComponent(category)}?limit=0`, signal);
}

export function getProductById(id, signal) {
	return request(`/products/${encodeURIComponent(id)}`, signal);
}
