import { LoaderCircle } from 'lucide-react';

const Loader = ({ label = 'Loading products...' }) => (
	<div className="flex min-h-56 items-center justify-center gap-3 text-sm text-gray-600" role="status" aria-live="polite">
		<LoaderCircle size={20} className="animate-spin text-sky-600" aria-hidden="true" />
		<span>{label}</span>
	</div>
);

export default Loader;
