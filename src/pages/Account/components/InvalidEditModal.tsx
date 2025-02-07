import { Modal } from '../../../components/Modal'
import { useSettings } from '../../../hooks/useSettings'

export function InvalidEditModal ({ errorMessage }: { errorMessage: string }) {
  const { setInvalidEditModalConfig, dictionary } = useSettings()

  const handleClose = () => {
    setInvalidEditModalConfig({
      visible: false,
      errorMessage: ''
    })
  }

  return (
    <Modal>
      <article className='p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-fit'>
        <button
          onClick={handleClose}
          className='absolute top-0 right-0 pr-[2%] pt-[1%] font-poppins-semibold text-[clamp(15px,4vw,20px)]'
        >
          X
        </button>

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.errorDuringAccountEditing?.value}
        </h2>

        <span className='text-center font-poppins-regular text-[clamp(20px,7vw,40px)]  '>{errorMessage}</span>
      </article>
    </Modal>
  )
}
