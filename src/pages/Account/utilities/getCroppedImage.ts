import { Area } from 'react-easy-crop'
import { getImage } from './getImage'

export async function getCroppedImage (
  imageFile: File,
  croppedAreaPixels: Area,
  fileName?: string | number
): Promise<File | null> {
  const imageSrc = URL.createObjectURL(imageFile)
  const image = await getImage(imageSrc)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) return null

  canvas.width = croppedAreaPixels.width
  canvas.height = croppedAreaPixels.height

  context.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    canvas.width,
    canvas.height
  )

  return new Promise(resolve => {
    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], String(fileName) || 'cropped-image', {
          type: 'image/webp'
        })
        resolve(file)
      }
    }, 'image/webp')
  })
}
