import { useSession } from '../hooks/useSession'
import { Comment } from '../models/Comment'
import { UserImage } from './UserImage'
import { Username } from './Username'
import { CommentMenu } from './CommentMenu'
import { useSettings } from '../hooks/useSettings'

export function CommentHeader (props: {
  comment: Comment
  onDelete: (commentId: number) => void
}) {
  const { loggedUser } = useSession()
  const { getMessage } = useSettings()

  const handleDelete = async () => {
    if (!props.comment.id) return

    props.onDelete(props.comment.id)
  }

  if (!props.comment.user.id) return

  return (
    <header className='w-full flex items-center relative'>
      <div className='w-[93%] gap-x-[3%] px-1 flex items-center'>
        <UserImage
          className='mobile:w-[clamp(40px,100%,50px)] desktop:w-[clamp(40px,100%,60px)]'
          user={props.comment.user}
        />

        <div className='w-full'>
          <Username
            user={props.comment.user}
            className='mobile:text-[clamp(15px,1rem,20px)] desktop:text-[clamp(20px,1.8rem,25px)]'
          />
        </div>

        <span className='text-caribbean-current font-poppins-light mobile:text-[clamp(5px,5vw,15px)] desktop:text-[clamp(5px,5vw,18px)]'>
          {getMessage(props.comment.date)}
        </span>
      </div>

      {props.comment.user.id &&
        loggedUser?.isOwnerOfComment({ comment: props.comment }) && (
          <div className='h-full content-center justify-center absolute top-0 right-0'>
            <CommentMenu onDelete={handleDelete} />
          </div>
        )}
    </header>
  )
}
