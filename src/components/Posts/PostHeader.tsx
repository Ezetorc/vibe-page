import { useUser } from '../../hooks/useUser'
import { PostData } from '../../models/PostData'
import { Username } from '../Username'
import { PostMenu } from './PostMenu'

export function PostHeader (props: {
  postData: PostData
  onDelete: (postId: number) => void
}) {
  const { user } = useUser()

  const handleDelete = async () => {
    if (!props.postData.id) return

    props.onDelete(props.postData.id)
  }

  if (!props.postData.user?.id) return

  return (
    <header className='w-full h-[70px] grid grid-cols-[15fr_5fr_1fr] items-center'>
      <img className='rounded-full w-[50px] aspect-square bg-orange-crayola' />

      <Username>{props.postData.user?.name}</Username>

      <span className='text-caribbean-current h-full flex justify-end items-center text-right font-poppins-light text-[clamp(5px,6vw,20px)]'>
        {props.postData.date}
      </span>

      {user?.isOwnerOfPost({ postUserId: props.postData.user?.id }) && (
        <div className='flex justify-end items-center'>
          <PostMenu onDelete={handleDelete} />
        </div>
      )}
    </header>
  )
}
