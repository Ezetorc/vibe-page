import { PostData } from '../../models/PostData'

export function PostContent (props: { postData: PostData }) {
  return (
    <main className='w-full flex flex-col'>
      <p className='break-words text-white text-[clamp(5px,6vw,20px)] font-poppins-regular'>
        {props.postData.content}
      </p>
    </main>
  )
}
