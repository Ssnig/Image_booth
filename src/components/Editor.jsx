import { useState, useEffect } from 'react'
import TemplateSelector from './TemplateSelector'
import PhotoCanvas from './PhotoCanvas'
import EditorControls from './EditorControls'
import { ArrowLeft, Check } from 'lucide-react'

const Editor = ({ processedImage, selectedTemplate, onTemplateSelect, onComplete, onCancel }) => {
  // Initialize position and scale from template - use effect with cleanup to avoid cascading renders
  const [imagePosition, setImagePosition] = useState({ x: 0.5, y: 0.5 })
  const [imageScale, setImageScale] = useState(1)
  const [personalMessage, setPersonalMessage] = useState('')

  // Update position and scale when template changes
  useEffect(() => {
    if (selectedTemplate) {
      const timer = setTimeout(() => {
        setImagePosition(selectedTemplate.defaultPosition || { x: 0.5, y: 0.5 })
        setImageScale(selectedTemplate.defaultScale || 1)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [selectedTemplate])

  const handlePositionChange = (position) => {
    setImagePosition(position)
  }

  const handleScaleChange = (scale) => {
    setImageScale(scale)
  }

  const handleReset = () => {
    if (selectedTemplate) {
      setImagePosition(selectedTemplate.defaultPosition || { x: 0.5, y: 0.5 })
      setImageScale(selectedTemplate.defaultScale || 1)
    }
  }

  const handleComplete = () => {
    // Prepare the final configuration for canvas rendering
    const finalConfig = {
      processedImage,
      selectedTemplate,
      imagePosition,
      imageScale,
      personalMessage
    }
    onComplete(finalConfig)
  }

  const imageUrl = processedImage?.url || processedImage

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h2 className="text-2xl font-bold text-gray-900">Edit Your Photo</h2>

        <button
          onClick={handleComplete}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Check className="w-5 h-5" />
          <span>Generate</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Template Selector - Desktop only */}
        <div className="hidden lg:block lg:col-span-3">
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateSelect={onTemplateSelect}
          />
        </div>

        {/* Center: Canvas */}
        <div className="lg:col-span-6">
          <PhotoCanvas
            processedImage={imageUrl}
            selectedTemplate={selectedTemplate}
            imagePosition={imagePosition}
            imageScale={imageScale}
            onPositionChange={handlePositionChange}
            personalMessage={personalMessage}
          />
        </div>

        {/* Right: Controls */}
        <div className="lg:col-span-3 space-y-6">
          {/* Mobile: Template Selector */}
          <div className="lg:hidden">
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={onTemplateSelect}
            />
          </div>

          <EditorControls
            imageScale={imageScale}
            onPositionChange={handlePositionChange}
            onScaleChange={handleScaleChange}
            onReset={handleReset}
            personalMessage={personalMessage}
            onMessageChange={setPersonalMessage}
          />
        </div>
      </div>
    </div>
  )
}

export default Editor
