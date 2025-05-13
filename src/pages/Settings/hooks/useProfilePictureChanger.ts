import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { CLOUDINARY } from '../../../constants/CLOUDINARY'
import { QUERY_KEYS } from '../../../constants/QUERY_KEYS'
import { useSession } from '../../../hooks/useSession'
import { useSettings } from '../../../hooks/useSettings'
import { Post } from '../../../models/Post'
import { User } from '../../../models/User'

export function useProfilePictureChanger (image: File | null) {
  const queryClient = useQueryClient()
  const { loggedUser, setLoggedUser } = useSession()
  const { closeModal } = useSettings()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const updateCache = (newPublicId: string, newSecureUrl: string) => {
    queryClient.setQueryData(
      QUERY_KEYS.user(loggedUser?.id),
      (prevUser?: User) => {
        if (!prevUser) return prevUser

        return prevUser.update({
          imageId: newPublicId,
          imageUrl: newSecureUrl
        })
      }
    )

    queryClient.setQueriesData(
      { queryKey: QUERY_KEYS.posts(), exact: false },
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

  const handleNewImage = async () => {
    if (!image || !loggedUser || isLoading) return

    const { secure_url: newSecureUrl, public_id: newPublicId } =
      await CLOUDINARY.upload({
        file: image,
        preset: 'profile_images'
      })

    await loggedUser.saveImage(newSecureUrl, newPublicId)

    const newLoggedUser = loggedUser.update({
      imageId: newPublicId,
      imageUrl: newSecureUrl
    })

    updateCache(newPublicId, newSecureUrl)
    setLoggedUser(newLoggedUser)
  }

  const uploadImage = async () => {
    if (!image || !loggedUser || isLoading) return

    setIsLoading(true)
    handleNewImage()
    closeModal()
    setIsLoading(false)
  }

  return { isLoading, uploadImage }
}
