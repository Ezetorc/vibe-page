import { Notification } from '../../../models/Notification'
import { NotificationDisplay } from './NotificationDisplay'

export function NotificationsDisplay (props: { notifications: Notification[] }) {
  return (
    <div className='w-full flex flex-col items-center gap-y-[20px]'>
      {props.notifications.map((notification, index) => (
        <NotificationDisplay key={index} notification={notification} />
      ))}
    </div>
  )
}
