// Canvas rendering utility for image composition

export const renderCanvas = async (canvas, config) => {
  const {
    background,
    personImage,
    personPosition,
    personScale,
    frame,
    eventTitle,
    personalMessage,
    width,
    height
  } = config

  const ctx = canvas.getContext('2d')
  
  // Set canvas dimensions
  canvas.width = width
  canvas.height = height

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Layer 1: Background
  if (background) {
    try {
      const bgImage = await loadImage(background)
      ctx.drawImage(bgImage, 0, 0, width, height)
    } catch (error) {
      console.error('Failed to load background:', error)
      // Fallback background color
      ctx.fillStyle = '#f3e8ff'
      ctx.fillRect(0, 0, width, height)
    }
  } else {
    // Default background
    ctx.fillStyle = '#f3e8ff'
    ctx.fillRect(0, 0, width, height)
  }

  // Layer 2: Decorative elements (optional)
  // Can be added later

  // Layer 3: Person with transparent background
  if (personImage) {
    try {
      const personImg = await loadImage(personImage)
      
      // Calculate person dimensions and position
      const personWidth = (width * 0.3) * personScale
      const personHeight = (height * 0.5) * personScale
      const personX = (personPosition.x * width) - (personWidth / 2)
      const personY = (personPosition.y * height) - (personHeight / 2)

      // Draw person
      ctx.drawImage(personImg, personX, personY, personWidth, personHeight)
      
      // Layer 4: Person shadow (optional)
      ctx.save()
      ctx.globalAlpha = 0.2
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.ellipse(
        personX + personWidth / 2,
        personY + personHeight - 10,
        personWidth / 2,
        10,
        0, 0, Math.PI * 2
      )
      ctx.fill()
      ctx.restore()
    } catch (error) {
      console.error('Failed to load person image:', error)
    }
  }

  // Layer 5: Frame/overlay
  if (frame) {
    try {
      const frameImage = await loadImage(frame)
      ctx.drawImage(frameImage, 0, 0, width, height)
    } catch (error) {
      console.error('Failed to load frame:', error)
    }
  }

  // Layer 6: Event branding
  if (eventTitle) {
    ctx.save()
    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 32px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    ctx.fillText(eventTitle, width / 2, 50)
    ctx.restore()
  }

  // Layer 7: Personal message text
  if (personalMessage) {
    ctx.save()
    ctx.fillStyle = '#4b5563'
    ctx.font = 'italic 24px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(personalMessage, width / 2, height - 30)
    ctx.restore()
  }

  return canvas
}

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
