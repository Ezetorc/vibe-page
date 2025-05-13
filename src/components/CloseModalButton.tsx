import { useSettings } from '../hooks/useSettings'
import { ExitIcon } from './Icons'

export function CloseModalButton () {
  const { closeModal } = useSettings()

  return (
    <button
      onClick={() => closeModal()}
      className='absolute cursor-pointer top-0 right-0 p-[1%] font-poppins-semibold text-[clamp(15px,4vw,20px)]'
    >
      <ExitIcon />
    </button>
  )
}
