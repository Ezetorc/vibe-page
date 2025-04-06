import { useUser } from '../../hooks/useUser'
import { CommentData } from '../../models/CommentData'
import { UserImage } from '../UserImage'
import { Username } from '../Username'
import { CommentMenu } from './CommentMenu'

export function CommentHeader (props: {
  commentData: CommentData
  onDelete: (commentId: number) => void
}) {
  const { user } = useUser()
  const isLoading = !props.commentData.user && !props.commentData.date

  const handleDelete = async () => {
    if (!props.commentData.id) return

    props.onDelete(props.commentData.id)
  }

  if (!props.commentData.user?.id) return

  return (
    <header
      className='w-full mobile:h-[140px] desktop:h-[70px] place-items-center 
    grid mobile:grid-cols-[1fr_1fr] desktop:grid-cols-[2fr_7fr_4fr_1fr] 
    mobile:grid-rows-[auto_auto_auto] desktop:grid-rows-1'
    >
      {isLoading ? (
        <div className='w-full h-full animate-shimmer bg-shimmer'>123</div>
      ) : (
        <>
          <UserImage user={props.commentData.user} />

          <Username
            id={props.commentData.user.id}
            className='mobile:text-center desktop:text-left mobile:text-[clamp(5px,0.9rem,20px)] desktop:text-[clamp(20px,1.8rem,21px)] desktop:col-auto desktop:row-auto mobile:col-span-2 mobile:row-[2]'
          >
            {props.commentData.user.name}
          </Username>

          <span className='mobile:col-span-2 mobile:row-[3] desktop:col-auto desktop:row-auto text-caribbean-current h-full flex justify-center items-center text-center font-poppins-light text-[clamp(5px,6vw,20px)]'>
            {props.commentData.date}
          </span>

          {user?.isOwnerOfPost({ postUserId: props.commentData.user.id }) && (
            <div className='mobile:col-[2] mobile:row-[1] desktop:col-auto desktop:row-auto flex desktop:justify-center mobile:justify-self-end items-center'>
              <CommentMenu onDelete={handleDelete} />
            </div>
          )}
        </>
      )}
    </header>
  )
}
