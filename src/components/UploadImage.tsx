import { ChangeEvent, useState } from 'react'
import { cloudinary } from "../constants/settings.ts"

const UploadImage = () => {
  const [image, setImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0]
    setImage(file)
  }

  const handleUpload = async () => {
    if (!image) return alert('Selecciona una imagen primero.')

    const formData = new FormData()
    formData.append('file', image)
    formData.append('upload_preset', 'profile_images') 

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinary}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )

      const data = await response.json()
      setImageUrl(data.secure_url) 
    } catch (error) {
      console.error('Error al subir la imagen:', error)
    }
  }

  return (
    <div>
      <input type='file' onChange={handleImageChange} />
      <button onClick={handleUpload}>Subir Imagen</button>

      {imageUrl && (
        <div>
          <p>Imagen subida:</p>
          <img src={imageUrl} alt='Imagen subida' width='200' />
        </div>
      )}
    </div>
  )
}

export default UploadImage
