import { CircleAlert } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => (
	<div className="flex min-h-56 flex-col items-center justify-center gap-3 text-center" role="alert">
		<CircleAlert size={24} className="text-red-600" aria-hidden="true" />
		<p className="max-w-md text-sm text-gray-700">{message}</p>
		{onRetry && (
			<button
				type="button"
				onClick={onRetry}
				className="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
			>
				Try again
			</button>
		)}
	</div>
);

export default ErrorMessage;
