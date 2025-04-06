import { Button } from '../../../components/Button'
import { CloseModalButton } from '../../../components/CloseModalButton'
import { Modal } from '../../../components/Modal'
import { ChangeEvent } from 'react'
import { useUser } from '../../../hooks/useUser'
import { User } from '../../../models/User'
import { useSettings } from '../../../hooks/useSettings'
import { UserImage } from '../../../components/UserImage'
import { PATHS } from '../../../constants/PATHS'

export function ChangePictureModal () {
  const { user, isSessionActive, setUser } = useUser()
  const { openModal, dictionary, closeModal } = useSettings()

  if (!isSessionActive()) return

  const handleUploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const newImage = event.target.files?.[0]

    if (newImage) {
      openModal('crop', { newImage })
    }
  }

  const handleRemoveImage = async () => {
    if (!user) return

    try {
      user.saveImage(null, null)

      const newUser = new User({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        description: user.description,
        createdAt: user.createdAt,
        imageId: null,
        imageUrl: null
      })

      setUser(newUser)
      closeModal()
    } catch {
      openModal('connection')
    }
  }

  return (
    <Modal>
      <article className='p-[clamp(10px,5%,20px)] items-center relative flex flex-col gap-4 rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(300px,fit,600px)]'>
        <CloseModalButton />

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.changePicture}
        </h2>

        <section className='flex gap-x-[5%]'>
          <div className='flex flex-col justify-center gap-y-[30px] items-center'>
            <UserImage
              className='border-verdigris desktop:w-[clamp(40px,30vw,300px)] mobile:w-[clamp(40px,30vw,90px)]'
              user={user}
            />

            <label className='cursor-pointer text-center hover:bg-white hover:text-orange-crayola p-[10px] w-full h-[50px] bg-orange-crayola  rounded-vibe flex items-center justify-center'>
              {dictionary.uploadImage}
              <input
                type='file'
                className='hidden'
                accept='image/*'
                onChange={handleUploadImage}
              />
            </label>
          </div>

          {user!.imageUrl && (
            <div className='flex flex-col justify-center gap-y-[30px] items-center'>
              <UserImage
                className='border-verdigris desktop:w-[clamp(40px,30vw,300px)] mobile:w-[clamp(40px,30vw,90px)]'
                src={PATHS.guestImage}
              />

              <Button
                text={dictionary.removeImage}
                onClick={handleRemoveImage}
              />
            </div>
          )}
        </section>
      </article>
    </Modal>
  )
}
