import { ChangeEvent, useState, useEffect } from 'react'
import { useAccount } from '../hooks/useAccount'
import { useSettings } from '../../../hooks/useSettings'
import { cloudinary } from '../../../constants/settings'
import { useUser } from '../../../hooks/useUser'
import { User } from '../../../models/User'
import { UserService } from '../../../services/UserService'

export function AccountPicture () {
  const { setVisibleModal, dictionary } = useSettings()
  const { user, setUser } = useUser()
  const account = useAccount()
  const [imageUrl, setImageUrl] = useState<string>(account.user?.imageUrl || '')
  const [publicId, setPublicId] = useState<string | null>(
    account.user?.imageId || null
  )

  useEffect(() => {
    setImageUrl(account.user?.imageUrl || '')
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
      const { secure_url, public_id } = await cloudinary.upload({
        file: image,
        uploadPreset: 'profile_images'
      })

      if (publicId) {
        const imageDeleted = await UserService.deleteImage(publicId)

        if (!imageDeleted) {
          setVisibleModal({ name: 'connection' })
        }
      }

      await saveImageToDatabase(secure_url, public_id)
      setImageUrl(secure_url)
      setPublicId(public_id)
    } catch {
      setVisibleModal({ name: 'connection' })
    }
  }

  const saveImageToDatabase = async (imageUrl: string, publicId: string) => {
    if (!user) return

    try {
      await user.changeImageUrl({ newImageUrl: imageUrl })
      await user.changeImageId({ newImageId: publicId })

      const newUser = new User({
        ...user,
        imageId: publicId,
        imageUrl: imageUrl
      })
      setUser(newUser)
    } catch {
      setVisibleModal({ name: 'connection' })
    }
  }

  return (
    <div className='relative rounded-full w-[clamp(40px,10vw,100px)] overflow-hidden aspect-square border-orange-crayola border-vibe'>
      <img
        title={`${account.user?.name} Profile Picture`}
        className='absolute w-full h-full'
        src={imageUrl}
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
