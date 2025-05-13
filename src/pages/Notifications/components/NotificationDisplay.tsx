import { Notification } from '../../../models/Notification'
import { Displays } from '../models/Displays'
import { CommentNotificationDisplay } from './CommentNotificationDisplay'
import { FollowNotificationDisplay } from './FollowNotificationDisplay'
import { LikeNotificationDisplay } from './LikeNotificationDisplay'
import { PostNotificationDisplay } from './PostNotificationDisplay'

export function NotificationDisplay (props: { notification: Notification }) {
  const displays: Displays = {
    like: <LikeNotificationDisplay notification={props.notification} />,
    comment: <CommentNotificationDisplay notification={props.notification} />,
    follow: <FollowNotificationDisplay notification={props.notification} />,
    post: <PostNotificationDisplay notification={props.notification} />
  }

  return (
    <article className='w-full relative items-center p-[1%] gap-x-[1%] flex border-vibe border-caribbean-current rounded-vibe'>
      {displays[props.notification.type]}
    </article>
  )
}
