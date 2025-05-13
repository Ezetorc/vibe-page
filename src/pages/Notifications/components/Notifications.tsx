import { useEffect } from 'react'
import { Button } from '../../../components/Button'
import { LoadSpinner } from '../../../components/LoadSpinner'
import { Section } from '../../../components/Section'
import { useSession } from '../../../hooks/useSession'
import { useSettings } from '../../../hooks/useSettings'
import { useNotifications } from '../hooks/useNotifications'
import { NotificationsDisplay } from './NotificationsDisplay'

export default function Notifications () {
  const { loggedUser } = useSession()
  const { dictionary } = useSettings()
  const {
    notifications,
    success,
    isEmpty,
    hasMore,
    ref,
    markAsSeen,
    clearNotifications
  } = useNotifications(loggedUser)

  useEffect(markAsSeen, [markAsSeen])

  return (
    <Section>
      <header className='w-full'>
        <Button
          classname='w-full'
          filled={isEmpty ? false : true}
          onClick={clearNotifications}
          text={dictionary.clearNotifications}
        />
      </header>

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
    </Section>
  )
}
