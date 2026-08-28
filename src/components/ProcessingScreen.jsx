import { useEffect, useState, useRef } from 'react'
import LoadingSpinner from './LoadingSpinner'
import { Brain, AlertCircle, RefreshCw } from 'lucide-react'
import { removeBackground } from '../utils/backgroundRemoval'

const ProcessingScreen = ({ image, onComplete, onError }) => {
  const [status, setStatus] = useState('Initializing...')
  const [error, setError] = useState(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const isProcessing = useRef(false)
  const shouldProcess = useRef(true)

  const processImage = async () => {
    if (isProcessing.current || !shouldProcess.current) return

    isProcessing.current = true
    shouldProcess.current = false

    try {
      setError(null)
      setStatus('Loading AI model...')

      // Perform actual background removal
      const result = await removeBackground(image)

      setStatus('Processing complete!')

      // Pass the processed image to the parent
      onComplete(result)

    } catch (err) {
      console.error('Background removal error:', err)
      setError(err.message || 'Failed to process your image. Please try again.')
      setStatus('Processing failed')
    } finally {
      isProcessing.current = false
    }
  }

  useEffect(() => {
    shouldProcess.current = true
    isProcessing.current = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    processImage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image])

  const handleRetry = () => {
    setIsRetrying(true)
    setError(null)
    setStatus('Retrying...')
    shouldProcess.current = true
    isProcessing.current = false
    processImage()
  }

  const handleCancel = () => {
    onError && onError()
  }

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {error ? (
          <>
            <div className="flex justify-center mb-6">
              <AlertCircle className="w-20 h-20 text-red-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Processing Failed
            </h2>
            
            <p className="text-gray-600 mb-8">
              {error}
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Retrying...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    <span>Try Again</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <Brain className="w-20 h-20 text-purple-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Processing Your Photo
            </h2>
            
            <p className="text-gray-600 mb-8">
              {status}
            </p>
            
            <div className="mb-6">
              <LoadingSpinner />
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
              <div className="bg-purple-600 h-3 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
            
            <p className="text-sm text-gray-500">
              Please wait while we remove the background...
            </p>
            
            <div className="mt-8 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700">
                <strong>Note:</strong> Background removal is powered by AI. 
                This process runs entirely in your browser for privacy.
                First-time processing may take longer as the AI model loads.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProcessingScreen
