import { useSettings } from '../hooks/useSettings'
import { UsersDisplayProps } from '../models/Props/UsersDisplayProps'
import { UserDisplay } from './UserDisplay'

export function UsersDisplay (props: UsersDisplayProps) {
  const { dictionary } = useSettings()

  return (
    <div className='w-full flex flex-col items-center gap-y-[20px]'>
      {props.users?.length === 0 ? (
        <span>{dictionary.noUsers}</span>
      ) : (
        props.users?.map(user => <UserDisplay key={user.id} user={user} />)
      )}
    </div>
  )
}
