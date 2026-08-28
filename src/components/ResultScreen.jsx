import { useState, useRef, useEffect } from 'react'
import { Download, Share2, ArrowLeft, RotateCcw, Loader2 } from 'lucide-react'
import { toPng } from 'html-to-image'
import { renderCanvas } from '../utils/canvasRenderer'

const ResultScreen = ({ finalConfig, onReset, onBackToEditor }) => {
  const canvasRef = useRef(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const generateFinalImage = async () => {
      if (!finalConfig || !canvasRef.current) return

      setIsGenerating(true)
      setIsReady(false)

      try {
        const { selectedTemplate, processedImage, imagePosition, imageScale, personalMessage } = finalConfig
        
        // High resolution for download
        const width = 1200
        const height = width / (selectedTemplate.aspectRatio || 4/3)

        const imageUrl = processedImage?.url || processedImage

        await renderCanvas(canvasRef.current, {
          background: selectedTemplate.background,
          personImage: imageUrl,
          personPosition: imagePosition,
          personScale: imageScale,
          frame: selectedTemplate.frame,
          eventTitle: selectedTemplate.eventTitle,
          personalMessage: personalMessage,
          width: width,
          height: height
        })

        setIsReady(true)
      } catch (error) {
        console.error('Failed to generate final image:', error)
      } finally {
        setIsGenerating(false)
      }
    }

    generateFinalImage()
  }, [finalConfig])

  const handleDownload = async () => {
    if (!canvasRef.current || !isReady) return

    try {
      const dataUrl = await toPng(canvasRef.current, {
        quality: 1.0,
        pixelRatio: 1
      })

      const link = document.createElement('a')
      link.download = `event-memory-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download image. Please try again.')
    }
  }

  const handleShare = async () => {
    if (!canvasRef.current || !isReady) return

    try {
      const dataUrl = await toPng(canvasRef.current, {
        quality: 0.9,
        pixelRatio: 1
      })

      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob()
        const file = new File([blob], 'event-memory.png', { type: 'image/png' })
        
        await navigator.share({
          title: 'My Event Memory',
          text: 'Check out my event memory photo!',
          files: [file]
        })
      } else {
        // Fallback: copy to clipboard or show message
        alert('Sharing is not supported on this browser. Please download and share manually.')
      }
    } catch (error) {
      console.error('Share failed:', error)
      if (error.name !== 'AbortError') {
        alert('Failed to share image. Please try downloading instead.')
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToEditor}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Editor</span>
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900">Your Memory is Ready!</h2>
        
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Start Over</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden mx-auto" style={{ maxWidth: '100%' }}>
            <canvas
              ref={canvasRef}
              style={{ 
                width: '100%',
                height: 'auto',
                maxWidth: '800px',
                display: 'block'
              }}
            />
            
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Generating your memory...</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownload}
            disabled={!isReady || isGenerating}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download Image</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleShare}
            disabled={!isReady || isGenerating}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>Success!</strong> Your event memory has been created at high resolution. 
            Download it to save it to your device or share it with friends.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResultScreen
