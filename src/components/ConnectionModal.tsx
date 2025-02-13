import { Modal } from './Modal'
import { useSettings } from '../hooks/useSettings'
import { CloseModalButton } from './CloseModalButton'
import { Button } from './Button'

export function ConnectionModal () {
  const { setVisibleModal, dictionary } = useSettings()

  const handleClose = () => {
    setVisibleModal({ name: null, message: '' })
  }

  const handleRefresh = () => {
    location.reload()
  }

  return (
    <Modal>
      <article className='p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-fit'>
        <CloseModalButton onClose={handleClose} />

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.connectionError}
        </h2>

        <span className='text-center font-poppins-regular text-[clamp(20px,7vw,40px)]  '>
          {dictionary.solveConnectionError}
        </span>
        
        <Button onClick={handleRefresh} text={dictionary.refreshPage} />
      </article>
    </Modal>
  )
}
