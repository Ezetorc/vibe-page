import { useSession } from '../hooks/useSession'
import { useSettings } from '../hooks/useSettings'
import { Post } from '../models/Post'
import { UserImage } from './UserImage'
import { Username } from './Username'
import { PostMenu } from './PostMenu'

export function PostHeader (props: {
  post: Post
  onDelete: (post: Post) => void
}) {
  const { loggedUser } = useSession()
  const { getMessage } = useSettings()
  const loggedUserIsOwner = loggedUser?.isOwnerOfPost({ post: props.post })
  const dateMessage = getMessage(props.post.date)

  const handleDelete = async () => {
    props.onDelete(props.post)
  }

  return (
    <header className='w-full flex items-center relative'>
      <div className='w-[93%] gap-x-[3%] px-1 flex items-center'>
        <UserImage
          className='mobile:w-[clamp(40px,100%,50px)] desktop:w-[clamp(40px,100%,60px)]'
          user={props.post.user}
        />

        <div className='w-full'>
          <Username
            user={props.post.user}
            className='w-full mobile:text-[clamp(15px,1rem,20px)] desktop:text-[clamp(20px,1.8rem,25px)]'
          />
        </div>

        <span className='text-caribbean-current font-poppins-light mobile:text-[clamp(5px,5vw,15px)] desktop:text-[clamp(5px,5vw,18px)]'>
          {dateMessage}
        </span>
      </div>

      {loggedUserIsOwner && (
        <div className='h-full content-center justify-center absolute top-0 right-0'>
          <PostMenu onDelete={handleDelete} />
        </div>
      )}
    </header>
  )
}
