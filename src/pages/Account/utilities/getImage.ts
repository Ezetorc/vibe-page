export function getImage (url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = url
    image.onload = () => resolve(image)
    image.onerror = error => reject(error)
  })
}
