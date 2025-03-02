import { ChangeEvent, useState, useEffect } from 'react'
import { useAccount } from '../hooks/useAccount'
import { useSettings } from '../../../hooks/useSettings'
import { cloudinary } from '../../../constants/settings'
import { useUser } from '../../../hooks/useUser'
import { User } from '../../../models/User'

export function AccountPicture () {
  const { openModal, dictionary } = useSettings()
  const { setUser } = useUser()
  const account = useAccount()
  const [imageUrl, setImageUrl] = useState<string | null>(
    account.user?.imageUrl || null
  )
  const [publicId, setPublicId] = useState<string | null>(
    account.user?.imageId || null
  )

  useEffect(() => {
    setImageUrl(account.user?.imageUrl || null)
    setPublicId(account.user?.imageId || null)
  }, [account.user])

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

      if (publicId) {
        const prevImageDeleted = await cloudinary.deleteImage({ publicId })

        if (prevImageDeleted.success) {
          await saveImageToDatabase(newSecureUrl, newPublicId)
          setImageUrl(newSecureUrl)
          setPublicId(newPublicId)
        } else {

          openModal('connection')
        }
      }
    } catch {

      openModal('connection')
    }
  }

  const saveImageToDatabase = async (imageUrl: string, publicId: string) => {
    if (!account.user) return

    try {
      await account.user.changeImageUrl({ newImageUrl: imageUrl })
      await account.user.changeImageId({ newImageId: publicId })

      const newUser = new User({
        ...account.user,
        imageId: publicId,
        imageUrl: imageUrl
      })

      setUser(newUser)
    } catch {
      openModal('connection')
    }
  }

  return (
    <div className='relative rounded-full w-[clamp(40px,10vw,100px)] overflow-hidden aspect-square border-orange-crayola border-vibe'>
      <img
        title={`${account.user?.name} Profile Picture`}
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
