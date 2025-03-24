import { Button } from '../../../components/Button'
import { useState } from 'react'
import { Modal } from '../../../components/Modal'
import { cloudinary } from '../../../constants/SETTINGS'
import { useSettings } from '../../../hooks/useSettings'
import { useUser } from '../../../hooks/useUser'
import { User } from '../../../models/User'
import { ImageCropper } from './ImageCropper'
import { useQueryClient } from '@tanstack/react-query'
import { UserData } from '../models/UserData'
import { PostData } from '../../../models/PostData'

export function CropImageModal () {
  const queryClient = useQueryClient()
  const { user, setUser } = useUser()
  const { openModal, closeModal, dictionary } = useSettings()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [croppedImage, setCroppedImage] = useState<File | null>(null)

  const updateCache = (newPublicId: string, newSecureUrl: string) => {
    queryClient.setQueryData(
      ['userData', 'me'],
      (prevUserData: UserData | null) => {
        if (!prevUserData) return prevUserData

        return new UserData({
          ...prevUserData,
          imageId: newPublicId,
          imageUrl: newSecureUrl
        })
      }
    )

    queryClient.setQueriesData(
      { queryKey: ['postData'] },
      (prevPostData: PostData) => {
        if (!prevPostData || !prevPostData.user) return prevPostData

        const newUser = new User({
          id: prevPostData.user.id,
          name: prevPostData.user.name,
          email: prevPostData.user.email,
          password: prevPostData.user.password,
          description: prevPostData.user.description,
          createdAt: prevPostData.user.createdAt,
          imageId: newPublicId,
          imageUrl: newSecureUrl
        })

        const newPostData = new PostData({
          ...prevPostData,
          user: newUser
        })

        return newPostData
      }
    )
  }

  const handleUpload = async () => {
    if (!croppedImage || !user || isLoading) return

    setIsLoading(true)

    try {
      const { secure_url: newSecureUrl, public_id: newPublicId } =
        await cloudinary.upload({
          file: croppedImage,
          preset: 'profile_images'
        })

      await saveImageToDatabase(newSecureUrl, newPublicId)

      const newUser = new User({
        ...user,
        imageId: newPublicId,
        imageUrl: newSecureUrl
      })

      updateCache(newPublicId, newSecureUrl)
      setUser(newUser)
      closeModal()
    } catch {
      openModal('connection')
    } finally {
      setIsLoading(false)
    }
  }

  const saveImageToDatabase = async (imageUrl: string, publicId: string) => {
    if (!user) return

    await cloudinary.deleteImage({ publicId: user.imageId! })
    await user.changeImageUrl({ newImageUrl: imageUrl })
    await user.changeImageId({ newImageId: publicId })
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
