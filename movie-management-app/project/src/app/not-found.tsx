export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="text-center p-8 bg-white rounded-lg shadow-md">
				<h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
				<h2 className="text-2xl text-gray-600 mb-4">Page Not Found</h2>
				<p className="text-gray-500 mb-6">
					The page you are looking for does not exist or has been moved.
				</p>
				<a
					href="/"
					className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
				>
					Return Home
				</a>
			</div>
		</div>
	);
}
