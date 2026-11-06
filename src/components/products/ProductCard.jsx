import { Link, useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  const roundedRating = Math.round(product.rating);
  const location = useLocation();

  return (
    <Link
      to={{ pathname: `/product/${product.id}`, search: location.search }}
      className="group flex min-w-0 flex-col rounded-md border border-gray-200 bg-white p-3 shadow-sm transition hover:border-gray-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
      aria-label={`View ${product.title}, $${product.price.toFixed(2)}, rating ${product.rating} out of 5`}
    >
      <div className="flex h-36 items-center justify-center border-b border-gray-100 sm:h-40">
        <img
          src={product.thumbnail}
          width="180"
          height="160"
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain p-2 transition-transform group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex min-h-20 flex-col justify-between gap-2 pt-3">
        <h2 className="line-clamp-2 text-sm font-medium text-gray-900">{product.title}</h2>
        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-semibold text-gray-900">${product.price.toFixed(2)}</span>
          <span className="flex shrink-0 items-center gap-1" aria-label={`${product.rating} out of 5 stars`}>
            <span className="flex text-amber-400" aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => (
                <Star key={index} size={14} fill={index < roundedRating ? 'currentColor' : 'none'} />
              ))}
            </span>
            <span className="text-xs text-gray-600">({product.rating})</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
