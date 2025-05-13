import { Button } from '../../../components/Button'
import { CloseModalButton } from '../../../components/CloseModalButton'
import { Modal } from '../../../components/Modal'
import { useSettings } from '../../../hooks/useSettings'
import { UserImage } from '../../../components/UserImage'
import { PATHS } from '../../../constants/PATHS'
import { useSession } from '../../../hooks/useSession'
import { ChangeEvent } from 'react'
import { useProfilePictureRemover } from '../hooks/useProfilePictureRemover'

export default function ChangePictureModal () {
  const { loggedUser, isSessionActive } = useSession()
  const { openModal, dictionary } = useSettings()
  const removeImage = useProfilePictureRemover()
  const hasImage = loggedUser?.imageUrl !== null

  const goToUploader = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isSessionActive) {
      openModal('session')
      return
    }

    const newImage = event.target.files?.[0]

    if (newImage) {
      openModal('crop', { newImage })
    }
  }

  return (
    <Modal>
      <article className='p-[clamp(10px,5%,20px)] items-center relative flex flex-col gap-4 rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(300px,fit,600px)]'>
        <CloseModalButton />

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.changeProfilePicture}
        </h2>

        <section className='flex gap-x-[5%]'>
          <div className='flex flex-col justify-center gap-y-[30px] items-center'>
            <UserImage
              className='border-verdigris desktop:w-[clamp(40px,30vw,300px)] mobile:w-[clamp(40px,30vw,90px)]'
              user={loggedUser}
            />

            <label className='cursor-pointer text-center desktop:hover:bg-white desktop:hover:text-orange-crayola p-[10px] w-full h-[50px] bg-orange-crayola  rounded-vibe flex items-center justify-center'>
              {dictionary.uploadImage}
              <input
                type='file'
                className='hidden'
                accept='image/*'
                onChange={goToUploader}
              />
            </label>
          </div>

          {hasImage && (
            <div className='flex flex-col justify-center gap-y-[30px] items-center'>
              <UserImage
                className='border-verdigris desktop:w-[clamp(40px,30vw,300px)] mobile:w-[clamp(40px,30vw,90px)]'
                src={PATHS.guestImage}
              />

              <Button
                classname='w-full'
                text={dictionary.removeImage}
                onClick={removeImage}
              />
            </div>
          )}
        </section>
      </article>
    </Modal>
  )
}
