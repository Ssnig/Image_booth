import { ZoomIn, ZoomOut, RotateCw, MessageSquare } from 'lucide-react'

const EditorControls = ({ imageScale, onScaleChange, onReset, personalMessage, onMessageChange }) => {
  const handleZoomIn = () => {
    onScaleChange(Math.min(imageScale + 0.1, 3))
  }

  const handleZoomOut = () => {
    onScaleChange(Math.max(imageScale - 0.1, 0.5))
  }

  const handleMessageChange = (e) => {
    onMessageChange(e.target.value)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Controls</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scale: {Math.round(imageScale * 100)}%
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={imageScale <= 0.5}
            >
              <ZoomOut className="w-5 h-5 text-gray-700" />
            </button>
            
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={imageScale}
              onChange={(e) => onScaleChange(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            
            <button
              onClick={handleZoomIn}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={imageScale >= 3}
            >
              <ZoomIn className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personal Message
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={personalMessage}
              onChange={handleMessageChange}
              placeholder="Thanks for visiting!"
              maxLength={50}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {personalMessage.length}/50 characters
          </p>
        </div>
        
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RotateCw className="w-4 h-4 text-gray-700" />
          <span className="text-sm text-gray-700">Reset Position & Scale</span>
        </button>
        
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Use the slider to adjust the size of your photo. 
            Drag the photo on the canvas to reposition it.
            Add a personal message to customize your poster.
          </p>
        </div>
      </div>
    </div>
  )
}

export default EditorControls
