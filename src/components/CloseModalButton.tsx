import { useSettings } from '../hooks/useSettings'

export function CloseModalButton () {
  const { closeModal } = useSettings()

  const handleClose = () => {
    closeModal()
  }

  return (
    <button
      onClick={handleClose}
      className='absolute cursor-pointer top-0 right-0 pr-[2%] pt-[1%] font-poppins-semibold text-[clamp(15px,4vw,20px)]'
    >
      X
    </button>
  )
}
