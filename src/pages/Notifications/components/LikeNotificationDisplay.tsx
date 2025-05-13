import { UserImage } from '../../../components/UserImage'
import { Username } from '../../../components/Username'
import { useSettings } from '../../../hooks/useSettings'
import { Notification } from '../../../models/Notification'
import { usePost } from '../hooks/usePost'
import { cutWord } from '../utilities/cutWord'

export function LikeNotificationDisplay (props: {
  notification: Notification
}) {
  const { dictionary } = useSettings()
  const { post } = usePost(props.notification.data?.postId)
  const postContent = `"${cutWord(post?.content)}"`

  return (
    <>
      <UserImage className='w-[60px]' user={props.notification.sender} />
      <Username user={props.notification.sender} />
      <span className='mobile:text-[clamp(8px,1rem,20px)] desktop:text-[clamp(10px,1.5rem,30px)]'>
        {dictionary.likedYourPost}
      </span>
      <span className='text-gray-400 mobile:text-[clamp(8px,1rem,20px)] desktop:text-[clamp(10px,1.5rem,30px)]'>
        {postContent}
      </span>
    </>
  )
}
