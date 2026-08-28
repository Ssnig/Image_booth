// Background removal utility using @imgly/background-removal
import { removeBackground as imglyRemoveBackground } from '@imgly/background-removal'

let objectURL = null

export const removeBackground = async (imageSource) => {
  try {
    // Clean up previous object URL if exists
    if (objectURL) {
      URL.revokeObjectURL(objectURL)
      objectURL = null
    }

    // Convert image source to blob if it's a data URL
    let imageBlob = imageSource

    if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
      const response = await fetch(imageSource)
      imageBlob = await response.blob()
    } else if (imageSource instanceof File) {
      imageBlob = imageSource
    }

    // Perform background removal
    const resultBlob = await imglyRemoveBackground(imageBlob)

    // Create object URL from the result
    objectURL = URL.createObjectURL(resultBlob)

    return {
      blob: resultBlob,
      url: objectURL
    }
  } catch (error) {
    console.error('Background removal failed:', error)
    throw new Error(`Background removal failed: ${error.message}`, { cause: error })
  }
}

export const cleanup = () => {
  if (objectURL) {
    URL.revokeObjectURL(objectURL)
    objectURL = null
  }
}
