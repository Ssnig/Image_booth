import { useRef, useState } from 'react'
import { Upload, Image as ImageIcon, AlertCircle, X } from 'lucide-react'

const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const ImageUploader = ({ onImageUpload }) => {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const validateFile = (file) => {
    // Check file type
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setError('Unsupported file format. Please use JPG, PNG, or WebP.')
      return false
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum size is 10MB.')
      return false
    }

    setError(null)
    return true
  }

  const handleFileSelect = (file) => {
    if (!file) return

    if (validateFile(file)) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target.result)
        setSelectedFile(file)
        setError(null)
      }
      reader.onerror = () => {
        setError('Failed to read the file. Please try again.')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = (e) => {
    e.stopPropagation()
    setPreview(null)
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleProcess = () => {
    if (selectedFile) {
      onImageUpload(selectedFile)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
          ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'}
          ${preview ? 'border-green-500 bg-green-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleInputChange}
          className="hidden"
        />

        {error ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-red-700 mb-2">Upload Error</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setError(null)
              }}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : preview ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-md"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-green-600 font-medium">Image uploaded successfully!</p>
            <p className="text-sm text-gray-500">Click to change image</p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleProcess()
              }}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Remove Background & Continue
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              {isDragging ? (
                <Upload className="w-16 h-16 text-purple-500" />
              ) : (
                <ImageIcon className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                {isDragging ? 'Drop your image here' : 'Upload your photo'}
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop or click to select
              </p>
            </div>
            <div className="text-xs text-gray-400">
              <p>Supports: JPG, PNG, WebP</p>
              <p>Maximum size: 10MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageUploader
