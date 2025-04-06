import { Button } from '../../../components/Button'
import { useState } from 'react'
import { Modal } from '../../../components/Modal'
import { useSettings } from '../../../hooks/useSettings'
import { useUser } from '../../../hooks/useUser'
import { User } from '../../../models/User'
import { ImageCropper } from './ImageCropper'
import { useQueryClient } from '@tanstack/react-query'
import { UserData } from '../models/UserData'
import { PostData } from '../../../models/PostData'
import { CLOUDINARY } from '../../../constants/CLOUDINARY'

export function CropImageModal () {
  const queryClient = useQueryClient()
  const { user, setUser } = useUser()
  const { openModal, closeModal, dictionary } = useSettings()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [croppedImage, setCroppedImage] = useState<File | null>(null)

  const updateCache = (newPublicId: string, newSecureUrl: string) => {
    queryClient.setQueryData(
      ['userData', user?.id],
      (prevUserData: UserData | null) => {
        if (!prevUserData) return prevUserData

        return prevUserData.update({
          imageId: newPublicId,
          imageUrl: newSecureUrl
        })
      }
    )

    queryClient.setQueriesData(
      { queryKey: ['postData'] },
      (prevPostData: PostData) => {
        if (!prevPostData || !prevPostData.user) return prevPostData

        return prevPostData.update({
          user: new User({
            id: prevPostData.user.id,
            name: prevPostData.user.name,
            email: prevPostData.user.email,
            password: prevPostData.user.password,
            description: prevPostData.user.description,
            createdAt: prevPostData.user.createdAt,
            imageId: newPublicId,
            imageUrl: newSecureUrl
          })
        })
      }
    )
  }

  const handleUpload = async () => {
    if (!croppedImage || !user || isLoading) return

    setIsLoading(true)

    try {
      const { secure_url: newSecureUrl, public_id: newPublicId } =
        await CLOUDINARY.upload({
          file: croppedImage,
          preset: 'profile_images'
        })

      await user.saveImage(newSecureUrl, newPublicId)

      const newUser = new User({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        description: user.description,
        createdAt: user.createdAt,
        imageId: newPublicId,
        imageUrl: newSecureUrl
      })

      console.log("newUser: ", newUser)

      updateCache(newPublicId, newSecureUrl)
      setUser(newUser)
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
            disabled={isLoading}
            text={
              isLoading ? `${dictionary.loading}...` : dictionary.uploadImage
            }
            onClick={handleUpload}
          />
        )}

        <Button
          type='outline'
          disabled={isLoading}
          classname={isLoading ? 'opacity-0' : ''}
          text={dictionary.cancel}
          onClick={closeModal}
        />
      </article>
    </Modal>
  )
}
