export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white/5 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-gray-700">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <h2 className="text-xl font-semibold text-white">Loading...</h2>
          <p className="text-gray-400 text-sm mt-2">Please wait while we prepare your data</p>
        </div>
      </div>
    </div>
  )
} 