import { UserImage } from '../../../components/UserImage'
import { Username } from '../../../components/Username'
import { useSettings } from '../../../hooks/useSettings'
import { Notification } from '../../../models/Notification'
import { useComment } from '../hooks/useComment'
import { usePost } from '../hooks/usePost'
import { cutWord } from '../utilities/cutWord'

export function CommentNotificationDisplay (props: {
  notification: Notification
}) {
  const { dictionary } = useSettings()
  const { post } = usePost(props.notification.data?.postId)
  const { comment } = useComment(props.notification.data?.commentId)
  const postContent = `"${cutWord(post?.content)}"`
  const commentContent = `"${cutWord(comment?.content)}"`

  return (
    <>
      <UserImage className='w-[60px]' user={props.notification.sender} />
      <Username user={props.notification.sender} />
      <span className='mobile:text-[clamp(8px,1rem,20px)] desktop:text-[clamp(10px,1.5rem,30px)]'>
        {dictionary.commentedOnYourPost}
      </span>
      <span className='text-gray-400 mobile:text-[clamp(8px,1rem,20px)] desktop:text-[clamp(10px,1.5rem,30px)]'>
        {postContent}
      </span>
      <span className='text-white mobile:text-[clamp(8px,1rem,20px)] desktop:text-[clamp(10px,1.5rem,30px)]'>
        {'>'}
      </span>
      <span className='text-gray-400 mobile:text-[clamp(8px,1rem,20px)] desktop:text-[clamp(10px,1.5rem,30px)]'>
        {commentContent}
      </span>
    </>
  )
}
