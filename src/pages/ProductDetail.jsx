
import { useEffect, useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { useParams } from 'react-router-dom';
import ErrorMessage from '../components/common/Error';
import Loader from '../components/common/Loader';
import Pagination from '../components/products/Pagination';
import { getProductById } from '../service/productApi';

const ProductDetail = ({ onBack }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [imagePage, setImagePage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    getProductById(id, controller.signal)
      .then(setProduct)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load this product.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id, retryCount]);

  const retry = () => {
    setLoading(true);
    setError(null);
    setRetryCount((count) => count + 1);
  };

  return (
    <main className="min-h-[calc(100vh-3.75rem)] bg-white p-5 sm:p-8 lg:p-10">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Back
      </button>

      {loading ? (
        <Loader label="Loading product..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={retry} />
      ) : product && (
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex min-h-90 flex-col border-b border-gray-100 pb-5 lg:min-h-140 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10">
            <div className="flex flex-1 items-center justify-center py-4">
              <img
                src={product.images?.[imagePage - 1] || product.thumbnail}
                alt={`${product.title} image ${imagePage}`}
                className="max-h-120 w-full object-contain"
              />
            </div>
            <div className="pt-4">
              <Pagination
                currentPage={imagePage}
                totalPages={Math.max(1, product.images?.length ?? 0)}
                onPageChange={setImagePage}
                label="Product image pages"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="border-b border-gray-200 pb-6">
              <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">{product.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="text-2xl font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                <span className="flex items-center gap-1" aria-label={`${product.rating} out of 5 stars`}>
                  <span className="flex text-amber-400" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star key={index} size={17} fill={index < Math.round(product.rating) ? 'currentColor' : 'none'} />
                    ))}
                  </span>
                  <span className="text-sm text-gray-600">({product.rating})</span>
                </span>
              </div>
              <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                <div><dt className="inline font-semibold text-gray-900">Brand: </dt><dd className="inline text-gray-600">{product.brand || 'Unbranded'}</dd></div>
                <div><dt className="inline font-semibold text-gray-900">Category: </dt><dd className="inline capitalize text-gray-600">{product.category}</dd></div>
              </dl>
            </div>

            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
              <p className="mt-3 leading-7 text-gray-600">{product.description}</p>
            </section>

            {product.reviews?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900">Reviews</h2>
                <div className="mt-4 flex flex-col gap-5">
                  {product.reviews.slice(0, 3).map((review, index) => (
                    <article key={`${review.reviewerName}-${index}`} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{review.reviewerName}</h3>
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <span className="flex text-amber-400" aria-hidden="true">
                            {Array.from({ length: 5 }, (_, starIndex) => (
                              <Star key={starIndex} size={14} fill={starIndex < review.rating ? 'currentColor' : 'none'} />
                            ))}
                          </span>
                          ({review.rating.toFixed(1)})
                        </span>
                      </div>
                      <p className="mt-2 leading-6 text-gray-600">{review.comment}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductDetail;