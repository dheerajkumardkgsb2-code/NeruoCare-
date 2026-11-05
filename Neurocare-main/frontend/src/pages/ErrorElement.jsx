

const ErrorElement = ()=>{
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
        <p className="text-gray-600 mb-4">Page not found</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorElement;