
import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ImageUploader from './components/ImageUploader'
import ProcessingScreen from './components/ProcessingScreen'
import Editor from './components/Editor'
import ResultScreen from './components/ResultScreen'
import { templates } from './data/templates'
import { cleanup } from './utils/backgroundRemoval'

// Application states
const APP_STATES = {
  UPLOAD: 'upload',
  PROCESSING: 'processing',
  EDITOR: 'editor',
  RESULT: 'result'
}

function App() {
  const [appState, setAppState] = useState(APP_STATES.UPLOAD)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0])
  const [finalConfig, setFinalConfig] = useState(null)

  const handleImageUpload = (imageFile) => {
    setUploadedImage(imageFile)
    setAppState(APP_STATES.PROCESSING)
  }

  const handleProcessingComplete = (processedImageResult) => {
    setProcessedImage(processedImageResult)
    setAppState(APP_STATES.EDITOR)
  }

  const handleProcessingError = () => {
    setAppState(APP_STATES.UPLOAD)
    setUploadedImage(null)
  }

  const handleEditorComplete = (editorConfig) => {
    setFinalConfig(editorConfig)
    setAppState(APP_STATES.RESULT)
  }

  const handleReset = () => {
    // Clean up object URLs
    cleanup()
    
    setAppState(APP_STATES.UPLOAD)
    setUploadedImage(null)
    setProcessedImage(null)
    setSelectedTemplate(templates[0])
    setFinalConfig(null)
  }

  const handleBackToEditor = () => {
    setAppState(APP_STATES.EDITOR)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {appState === APP_STATES.UPLOAD && (
          <>
            <Hero />
            <ImageUploader onImageUpload={handleImageUpload} />
          </>
        )}
        
        {appState === APP_STATES.PROCESSING && (
          <ProcessingScreen
            image={uploadedImage}
            onComplete={handleProcessingComplete}
            onError={handleProcessingError}
          />
        )}
        
        {appState === APP_STATES.EDITOR && (
          <Editor 
            processedImage={processedImage}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={setSelectedTemplate}
            onComplete={handleEditorComplete}
            onCancel={handleReset}
          />
        )}
        
        {appState === APP_STATES.RESULT && (
          <ResultScreen 
            finalConfig={finalConfig}
            onReset={handleReset}
            onBackToEditor={handleBackToEditor}
          />
        )}
      </main>
    </div>
  )
}

export default App
