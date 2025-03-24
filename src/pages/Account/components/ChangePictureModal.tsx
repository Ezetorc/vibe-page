import { Button } from '../../../components/Button'
import { CloseModalButton } from '../../../components/CloseModalButton'
import { Modal } from '../../../components/Modal'
import { ChangeEvent } from 'react'
import { cloudinary, images } from '../../../constants/SETTINGS'
import { useUser } from '../../../hooks/useUser'
import { User } from '../../../models/User'
import { useSettings } from '../../../hooks/useSettings'

export function ChangePictureModal () {
  const { user, setUser } = useUser()
  const { openModal, dictionary } = useSettings()

  if (!user) return

  const handleUploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const newImage = event.target.files?.[0]

    if (newImage) {
      openModal('crop', { newImage })
    }
  }

  const handleRemoveImage = async () => {
    try {
      if (user.imageId) {
        await cloudinary.deleteImage({ publicId: user.imageId })
      }

      await user.changeImageUrl({ newImageUrl: null })
      await user.changeImageId({ newImageId: null })

      const newUser = new User({
        ...user,
        imageUrl: null,
        imageId: null
      })

      setUser(newUser)
    } catch {
      openModal('connection')
    }
  }

  return (
    <Modal>
      <article className='p-[clamp(10px,5%,20px)] pt-[50px] items-center relative flex flex-col gap-4 rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(400px,80%,600px)]'>
        <CloseModalButton />

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.changePicture}
        </h2>

        <section className='flex gap-x-[5%]'>
          <div className='flex flex-col justify-center gap-y-[30px] items-center'>
            <img
              title={`${user?.name} Profile Picture`}
              className='rounded-full desktop:w-[clamp(40px,30vw,300px)] mobile:w-[clamp(40px,20vw,60px)] aspect-square border-orange-crayola border-vibe'
              src={user?.imageUrl ?? images.guest}
              alt='Profile'
            />

            <label className='cursor-pointer hover:bg-white hover:text-orange-crayola w-full h-[50px] bg-orange-crayola font-poppins-regular rounded-vibe flex items-center justify-center'>
              {dictionary.uploadImage}
              <input
                type='file'
                className='hidden'
                onChange={handleUploadImage}
              />
            </label>
          </div>

          {user.imageUrl && (
            <div className='flex flex-col justify-center gap-y-[30px] items-center'>
              <img
                title={`${user?.name} Profile Picture`}
                className='rounded-full desktop:w-[clamp(40px,30vw,300px)] mobile:w-[clamp(40px,20vw,60px)] aspect-square border-orange-crayola border-vibe'
                src={images.guest}
                alt='Profile'
              />

              <Button text={dictionary.removeImage} onClick={handleRemoveImage} />
            </div>
          )}
        </section>
      </article>
    </Modal>
  )
}
