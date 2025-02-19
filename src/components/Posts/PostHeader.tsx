import { useUser } from '../../hooks/useUser'
import { Username } from '../Username'
import { PostMenu } from './PostMenu'

export function PostHeader () {
  const { user } = useUser()

  const handleDelete = async () => {
    const deleted = await props.post.delete()

    if (deleted.success) {
      props.onDelete(props.post.id)
    }
  }

  return (
    <header className='w-full h-[70px] grid grid-cols-[15fr_5fr_1fr] items-center'>
      <img className='rounded-full w-[50px] aspect-square bg-orange-crayola' />

      <Username>{postData.user?.name}</Username>

      <span className='text-caribbean-current h-full flex justify-end items-center text-right font-poppins-light text-[clamp(5px,6vw,20px)]'>
        {postData.date}
      </span>

      {user?.isOwnerOfPost({ post: props.post }) && (
        <div className='flex justify-end items-center'>
          <PostMenu onDelete={handleDelete} />
        </div>
      )}
    </header>
  )
}
