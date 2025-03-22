import { ChangeEvent, useState, useEffect } from 'react'
import { useSettings } from '../../../hooks/useSettings'
import { useUser } from '../../../hooks/useUser'
import { User } from '../../../models/User'
import { cloudinary } from '../../../constants/SETTINGS'
import { UserData } from '../models/UserData'
import { UserService } from '../../../services/UserService'

export function AccountPicture (props: { userData: UserData }) {
  const { openModal, dictionary } = useSettings()
  const { setUser, user } = useUser()
  const [imageUrl, setImageUrl] = useState<string | null>(
    props.userData.imageUrl ?? null
  )
  const [publicId, setPublicId] = useState<string | null>(
    props.userData.imageId ?? null
  )

  useEffect(() => {
    setImageUrl(props.userData.imageUrl ?? null)
    setPublicId(props.userData.imageId ?? null)
  }, [props.userData.imageId, props.userData.imageUrl])

  if (!props.userData.id) return

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      uploadImage(file)
    }
  }

  const uploadImage = async (image: File) => {
    try {
      const { secure_url: newSecureUrl, public_id: newPublicId } =
        await cloudinary.upload({
          file: image,
          uploadPreset: 'profile_images'
        })

      await saveImageToDatabase(newSecureUrl, newPublicId)

      if (publicId) {
        const deleteSuccess = await cloudinary.deleteImage({ publicId })

        if (!deleteSuccess) {
          openModal('connection')
        }
      }

      setImageUrl(newSecureUrl)
      setPublicId(newPublicId)
    } catch {
      openModal('connection')
    }
  }

  const saveImageToDatabase = async (imageUrl: string, publicId: string) => {
    if (!props.userData.id) return

    const dataUser = await UserService.getById({ userId: props.userData.id })

    if (!dataUser || !user) return

    try {
      await dataUser.changeImageUrl({ newImageUrl: imageUrl })
      await dataUser.changeImageId({ newImageId: publicId })

      const newUser = new User({
        ...user,
        imageId: publicId,
        imageUrl: imageUrl
      })

      setUser(newUser)
    } catch {
      openModal('connection')
    }
  }

  return (
    <div className='relative rounded-full w-[clamp(40px,25vw,100px)] overflow-hidden aspect-square border-orange-crayola border-vibe'>
      <img
        title={`${props.userData.name} Profile Picture`}
        className='absolute w-full h-full'
        src={imageUrl ?? 'src/assets/images/guest_user.jpg'}
        alt='Profile'
      />
      <input
        onChange={handleImageChange}
        type='file'
        accept='image/*'
        title={dictionary.changeProfileImage}
        className='absolute w-full h-full cursor-pointer opacity-0'
      />
    </div>
  )
}
