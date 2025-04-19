import { Button } from '../../../components/Button'
import { useState } from 'react'
import { Modal } from '../../../components/Modal'
import { useSettings } from '../../../hooks/useSettings'
import { User } from '../../../models/User'
import { useQueryClient } from '@tanstack/react-query'
import { CLOUDINARY } from '../../../constants/CLOUDINARY'
import { useSession } from '../../../hooks/useSession'
import { Post } from '../../../models/Post'
import { QUERY_KEYS } from '../../../constants/QUERY_KEYS'
import { ImageCropper } from './ImageCropper'

export default function CropImageModal () {
  const queryClient = useQueryClient()
  const { loggedUser, setLoggedUser } = useSession()
  const { openModal, closeModal, dictionary } = useSettings()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [croppedImage, setCroppedImage] = useState<File | null>(null)

  const updateCache = (newPublicId: string, newSecureUrl: string) => {
    queryClient.setQueryData([QUERY_KEYS.User, loggedUser?.id], (prevUser?: User) => {
      if (!prevUser) return prevUser

      return prevUser.update({
        imageId: newPublicId,
        imageUrl: newSecureUrl
      })
    })

    queryClient.setQueriesData(
      { queryKey: [QUERY_KEYS.Post] },
      (prevPost?: Post) => {
        if (!prevPost || !prevPost.user) return prevPost

        return prevPost.update({
          user: prevPost.user.update({
            imageId: newPublicId,
            imageUrl: newSecureUrl
          })
        })
      }
    )
  }

  const handleUpload = async () => {
    if (!croppedImage || !loggedUser || isLoading) return

    setIsLoading(true)

    try {
      const { secure_url: newSecureUrl, public_id: newPublicId } =
        await CLOUDINARY.upload({
          file: croppedImage,
          preset: 'profile_images'
        })

      await loggedUser.saveImage(newSecureUrl, newPublicId)

      const newLoggedUser = loggedUser.update({
        imageId: newPublicId,
        imageUrl: newSecureUrl
      })

      updateCache(newPublicId, newSecureUrl)
      setLoggedUser(newLoggedUser)
      closeModal()
    } catch {
      openModal('connection')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal>
      <article className='p-[clamp(10px,5%,20px)] relative flex flex-col gap-4 rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(400px,80%,600px)]'>
        <ImageCropper onCropComplete={setCroppedImage} />

        {croppedImage && (
          <Button
          loading={isLoading}
            text={
              isLoading ? `${dictionary.loading}...` : dictionary.uploadImage
            }
            onClick={handleUpload}
          />
        )}

        <Button
          type='outline'
          loading={isLoading}
          classname={isLoading ? 'hidden' : ''}
          text={dictionary.cancel}
          onClick={closeModal}
        />
      </article>
    </Modal>
  )
}
