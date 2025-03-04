import { CloseModalButton } from '../../../components/CloseModalButton'
import { Modal } from '../../../components/Modal'
import { useSettings } from '../../../hooks/useSettings'

export function InvalidEditModal () {
  const { visibleModal, dictionary } = useSettings()

  return (
    <Modal>
      <article className='p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-fit'>
        <CloseModalButton />

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.errorDuringAccountEditing}
        </h2>

        <span className='text-center font-poppins-regular text-[clamp(20px,7vw,40px)]  '>
          {'data' in visibleModal &&
          typeof visibleModal.data === 'object' &&
          'message' in visibleModal.data
            ? String(visibleModal.data.message)
            : 'Error'}
        </span>
      </article>
    </Modal>
  )
}
