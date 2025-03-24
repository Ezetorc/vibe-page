import { Button } from '../../../components/Button'
import { Modal } from '../../../components/Modal'
import { CloseModalButton } from '../../../components/CloseModalButton'
import { useSettings } from '../../../hooks/useSettings'
import { useUser } from '../../../hooks/useUser'
import { useQueryClient } from '@tanstack/react-query'

export function LogoutModal () {
  const { isSessionActive, setUser } = useUser()
  const queryClient = useQueryClient()
  const { dictionary, openModal, closeModal } = useSettings()

  const handleLogout = async () => {
    if (!isSessionActive()) {
      openModal('session')
      return
    }

    queryClient.resetQueries({ queryKey: ['userData', 'me'] })
    queryClient.removeQueries({ queryKey: ['userData', 'me'] })
    localStorage.removeItem('session')
    setUser(null)
    closeModal()
  }

  return (
    <Modal>
      <article className='items-center p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(200px,auto,600px)]'>
        <CloseModalButton />

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.areYouSureLogout}
        </h2>

        <Button text={dictionary.logout} onClick={handleLogout} />
      </article>
    </Modal>
  )
}
