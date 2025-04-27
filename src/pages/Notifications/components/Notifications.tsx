import { useEffect } from 'react'
import { Button } from '../../../components/Button'
import { LoadSpinner } from '../../../components/LoadSpinner'
import { Nav } from '../../../components/Nav'
import { Section } from '../../../components/Section'
import { useSession } from '../../../hooks/useSession'
import { useSettings } from '../../../hooks/useSettings'
import { useNotifications } from '../hooks/useNotifications'
import { NotificationsDisplay } from './NotificationsDisplay'
import { NotificationService } from '../../../services/NotificationService'

export default function Notifications () {
  const { loggedUser } = useSession()
  const { dictionary } = useSettings()
  const { notifications, success, isEmpty, hasMore, ref, clearNotifications } =
    useNotifications(loggedUser)

  useEffect(() => {
    if (isEmpty) return

    const notificationIds: number[] = notifications.map(
      notification => notification.id
    )
    NotificationService.markAsSeen({ notificationIds })
  }, [notifications, isEmpty])

  return (
    <Section>
      {!isEmpty && (
        <header className='w-full'>
          <Button
            onClick={clearNotifications}
            text={dictionary.clearNotifications}
          />
        </header>
      )}

      {success ? (
        isEmpty ? (
          <span className='text-caribbean-current'>
            {dictionary.noNotificationsYet}
          </span>
        ) : (
          <NotificationsDisplay notifications={notifications} />
        )
      ) : (
        <LoadSpinner />
      )}

      {hasMore && <div className='w-full h-[20px]' ref={ref}></div>}

      <Nav />
    </Section>
  )
}
