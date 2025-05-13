import { UserImage } from '../../../components/UserImage'
import { Username } from '../../../components/Username'
import { useSettings } from '../../../hooks/useSettings'
import { Notification } from '../../../models/Notification'

export function FollowNotificationDisplay (props: {
  notification: Notification
}) {
  const { dictionary } = useSettings()

  return (
    <>
      <UserImage className='w-[60px]' user={props.notification.sender} />
      <Username user={props.notification.sender} />
      <span className='mobile:text-[clamp(8px,1rem,20px)] desktop:text-[clamp(10px,1.5rem,30px)]'>
        {dictionary.startedFollowingYou}
      </span>
    </>
  )
}
