import { Area } from 'react-easy-crop'
import { getImage } from './getImage'

export async function getCroppedImage (
  imageFile: File,
  croppedAreaPixels: Area,
  fileName?: string
): Promise<File | null> {
  const imageSrc = URL.createObjectURL(imageFile)
  const image = await getImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  

  if (!ctx) return null

  canvas.width = croppedAreaPixels.width
  canvas.height = croppedAreaPixels.height

  ctx.drawImage(
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
        const file = new File([blob], fileName ?? 'cropped-image', {
          type: 'image/webp'
        })
        resolve(file)
      }
    }, 'image/webp')
  })
}
