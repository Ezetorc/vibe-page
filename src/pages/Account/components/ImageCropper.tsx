import Cropper, { Area, Point } from 'react-easy-crop'
import { Slider } from '@mui/material'
import { getCroppedImage } from '../utilities/getCroppedImage'
import { useEffect, useState } from 'react'
import { useSettings } from '../../../hooks/useSettings'
import { useLoggedUser } from '../../../hooks/useLoggedUser'

export function ImageCropper (props: { onCropComplete: (file: File) => void }) {
  const { loggedUser } = useLoggedUser()
  const { activeModal } = useSettings()
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState<number>(1)
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  const newImage =
    activeModal.data && 'newImage' in activeModal.data
      ? (activeModal.data.newImage as File)
      : null

  useEffect(() => {
    if (!newImage) return

    const objectUrl = URL.createObjectURL(newImage)
    setImageSrc(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [newImage])

  if (!newImage) return null

  const handleCropComplete = async (_: Area, croppedAreaPixels: Area) => {
    const file = await getCroppedImage(
      newImage,
      croppedAreaPixels,
      String(loggedUser?.id)
    )

    if (file) {
      props.onCropComplete(file)
    }
  }

  return (
    <div className='relative w-full h-[500px]'>
      <Cropper
        image={imageSrc ?? ''}
        crop={crop}
        zoom={zoom}
        aspect={1 / 1}
        onCropChange={setCrop}
        onCropComplete={handleCropComplete}
        onZoomChange={setZoom}
      />

      <Slider
        value={zoom}
        min={1}
        max={3}
        step={0.1}
        aria-labelledby='Zoom'
        onChange={(_, zoom) => setZoom(Number(zoom))}
      />
    </div>
  )
}
