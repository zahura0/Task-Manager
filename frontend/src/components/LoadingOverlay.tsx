interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
}

export default function LoadingOverlay({ isVisible, message = 'Loading...' }: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50" style={{ backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 max-w-sm">
        {/* Animated Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 border-r-purple-600 animate-spin"></div>
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-gray-900 font-semibold text-lg">{message}</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we process your request...</p>
        </div>

        {/* Animated Dots */}
        <div className="flex gap-2">
          <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
          <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
    </div>
  )
}
