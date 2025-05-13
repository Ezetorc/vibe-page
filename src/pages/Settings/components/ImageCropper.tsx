import Cropper, { Area, Point } from 'react-easy-crop'
import { Slider } from '@mui/material'
import { getCroppedImage } from '../../Account/utilities/getCroppedImage'
import { useEffect, useMemo, useState } from 'react'
import { useSession } from '../../../hooks/useSession'

export function ImageCropper (props: {
  image: File
  onCropComplete: (file: File) => void
}) {
  const { loggedUser } = useSession()
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState<number>(1)
  const imageSrc = useMemo(
    () => URL.createObjectURL(props.image),
    [props.image]
  )

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(imageSrc)
    }
  }, [imageSrc])

  const handleCropComplete = async (_: Area, croppedArea: Area) => {
    const file = await getCroppedImage(props.image, croppedArea, loggedUser?.id)

    if (file) {
      props.onCropComplete(file)
    }
  }

  return (
    <div className='relative w-full h-[500px]'>
      <Cropper
        image={imageSrc}
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
