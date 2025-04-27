import { UserImage } from '../../../components/UserImage'
import { Username } from '../../../components/Username'
import { Notification } from '../../../models/Notification'
import { useUser } from '../../Account/hooks/useUser'

export function NotificationDisplay (props: { notification: Notification }) {
  const { user } = useUser(props.notification.senderId)
  

  return (
    <article className='w-full p-[1%] flex border-vibe border-caribbean-current rounded-vibe'>
      <UserImage className='w-[60px]' user={user} />
      <Username user={user} />
      {props.notification.type === 'like' ? (
        <span>Likeó tu post </span>
      ) : props.notification.type === 'comment' ? (
        <span>Comentó tu post </span>
      ) : props.notification.type === 'follow' ? (
        <span>Te empezó a seguir!</span>
      ) : (
        ''
      )}
    </article>
  )
}
