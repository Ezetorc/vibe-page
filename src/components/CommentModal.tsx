import { useSettings } from '../hooks/useSettings'
import { CloseModalButton } from './CloseModalButton'
import { Modal } from './Modal'
import { CommentCreator } from './CommentCreator'

export default function CommentModal () {
  const { modal, dictionary } = useSettings()

  if (!modal.has('postId')) return

  return (
    <Modal>
      <article className='items-center p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(600px,100%,700px)]'>
        <CloseModalButton />

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.comment}
        </h2>

        <CommentCreator />
      </article>
    </Modal>
  )
}
