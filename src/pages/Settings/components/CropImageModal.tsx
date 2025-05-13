import { useState } from 'react'
import { Button } from '../../../components/Button'
import { Modal } from '../../../components/Modal'
import { useSettings } from '../../../hooks/useSettings'
import { useProfilePictureChanger } from '../hooks/useProfilePictureChanger'
import { ImageCropper } from './ImageCropper'

export default function CropImageModal () {
  const { dictionary, closeModal, modal } = useSettings()
  const [croppedImage, setCroppedImage] = useState<File | null>(null)
  const { isLoading, uploadImage } = useProfilePictureChanger(croppedImage)
  const newImage = modal.has('newImage') ? modal.data!.newImage : undefined

  return (
    <Modal>
      {!newImage ? (
        <span>{dictionary.noImageSelected}</span>
      ) : (
        <article className='p-[clamp(10px,5%,20px)] relative flex flex-col gap-4 rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(400px,80%,600px)]'>
          <ImageCropper image={newImage} onCropComplete={setCroppedImage} />

          {croppedImage && (
            <Button
              classname='w-full'
              loading={isLoading}
              text={
                isLoading ? `${dictionary.loading}...` : dictionary.uploadImage
              }
              onClick={uploadImage}
            />
          )}

          <Button
            filled={false}
            loading={isLoading}
            classname={isLoading ? 'hidden' : 'w-full'}
            text={dictionary.cancel}
            onClick={() => closeModal()}
          />
        </article>
      )}
    </Modal>
  )
}
