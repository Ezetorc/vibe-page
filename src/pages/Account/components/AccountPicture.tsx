import { ChangeEvent, useState, useEffect } from 'react'
import { useSettings } from '../../../hooks/useSettings'
import { useUser } from '../../../hooks/useUser'
import { User } from '../../../models/User'
import { cloudinary } from '../../../constants/SETTINGS'
import { AccountData } from '../models/AccountData'

export function AccountPicture (props: { accountData: AccountData }) {
  const { openModal, dictionary } = useSettings()
  const { setUser } = useUser()
  const [imageUrl, setImageUrl] = useState<string | null>(
    props.accountData.user?.imageUrl ?? null
  )
  const [publicId, setPublicId] = useState<string | null>(
    props.accountData.user?.imageId ?? null
  )

  useEffect(() => {
    setImageUrl(props.accountData.user?.imageUrl ?? null)
    setPublicId(props.accountData.user?.imageId ?? null)
  }, [props.accountData.user])

  if (!props.accountData.user) return

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
    if (!props.accountData.user) return

    try {
      await props.accountData.user.changeImageUrl({ newImageUrl: imageUrl })
      await props.accountData.user.changeImageId({ newImageId: publicId })

      const newUser = new User({
        ...props.accountData.user,
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
        title={`${props.accountData.user.name} Profile Picture`}
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
