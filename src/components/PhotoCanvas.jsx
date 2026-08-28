import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { Move } from 'lucide-react'
import { renderCanvas } from '../utils/canvasRenderer'

const PhotoCanvas = ({ processedImage, selectedTemplate, imagePosition, imageScale, onPositionChange, personalMessage }) => {
  const canvasRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  // Calculate canvas size based on template aspect ratio (use memo to avoid setState in effect)
  const canvasSize = useMemo(() => {
    if (!selectedTemplate) return { width: 800, height: 600 }
    
    const maxWidth = 800
    const aspectRatio = selectedTemplate.aspectRatio || 4/3
    
    let width = maxWidth
    let height = width / aspectRatio
    
    // Adjust for mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      width = Math.min(window.innerWidth - 32, 400)
      height = width / aspectRatio
    }
    
    return { width, height }
  }, [selectedTemplate])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    // Convert pixel delta to normalized position delta
    const newX = Math.max(0.1, Math.min(0.9, imagePosition.x + (deltaX / canvasSize.width)))
    const newY = Math.max(0.1, Math.min(0.9, imagePosition.y + (deltaY / canvasSize.height)))

    onPositionChange({ x: newX, y: newY })
    setDragStart({ x: e.clientX, y: e.clientY })
  }, [isDragging, dragStart, imagePosition, canvasSize, onPositionChange])

  // Render canvas when dependencies change
  useEffect(() => {
    const render = async () => {
      if (!canvasRef.current || !selectedTemplate) return

      try {
        const imageUrl = processedImage?.url || processedImage
        
        await renderCanvas(canvasRef.current, {
          background: selectedTemplate.background,
          personImage: imageUrl,
          personPosition: imagePosition,
          personScale: imageScale,
          frame: selectedTemplate.frame,
          eventTitle: selectedTemplate.eventTitle,
          personalMessage: personalMessage,
          width: canvasSize.width,
          height: canvasSize.height
        })
        
        setIsLoaded(true)
      } catch (error) {
        console.error('Canvas rendering error:', error)
      }
    }

    render()
  }, [processedImage, selectedTemplate, imagePosition, imageScale, personalMessage, canvasSize])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch support for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    e.preventDefault()

    const touch = e.touches[0]
    const deltaX = touch.clientX - dragStart.x
    const deltaY = touch.clientY - dragStart.y

    const newX = Math.max(0.1, Math.min(0.9, imagePosition.x + (deltaX / canvasSize.width)))
    const newY = Math.max(0.1, Math.min(0.9, imagePosition.y + (deltaY / canvasSize.height)))

    onPositionChange({ x: newX, y: newY })
    setDragStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove])

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Poster Preview</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Move className="w-4 h-4" />
          <span>Drag to move</span>
        </div>
      </div>

      <div 
        className="relative bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 mx-auto"
        style={{ 
          width: canvasSize.width,
          height: canvasSize.height,
          maxWidth: '100%'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        />
        
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading canvas...</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>Position: X: {imagePosition.x.toFixed(2)}, Y: {imagePosition.y.toFixed(2)}</p>
        <p>Scale: {imageScale.toFixed(2)}x</p>
        <p>Size: {canvasSize.width}x{canvasSize.height}px</p>
      </div>
    </div>
  )
}

export default PhotoCanvas
