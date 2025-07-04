import { Button } from '../../../components/Button'
import { Modal } from '../../../components/Modal'
import { CloseModalButton } from '../../../components/CloseModalButton'
import { useSettings } from '../../../hooks/useSettings'
import { useSession } from '../../../hooks/useSession'

export default function LogoutModal () {
  const { logout, isSessionActive } = useSession()
  const { dictionary, openModal, closeModal } = useSettings()

  const handleLogout = async () => {
    if (!isSessionActive) {
      openModal('session')
      return
    }

    logout()
    closeModal()
  }

  return (
    <Modal>
      <article className='items-center p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(200px,auto,600px)]'>
        <CloseModalButton />

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.areYouSureLogout}
        </h2>

        <Button classname='w-full' text={dictionary.logout} onClick={handleLogout} />
      </article>
    </Modal>
  )
}
