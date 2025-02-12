import { useSettings } from '../hooks/useSettings'
import { UsersDisplayProps } from '../models/UsersDisplayProps'
import { UserDisplay } from './UserDisplay'

export function UsersDisplay ({ users }: UsersDisplayProps) {
  const { dictionary } = useSettings()

  return (
    <div className='w-full flex flex-col items-center gap-y-[20px]'>
      {users?.length === 0 ? (
        <span>{dictionary.noUsers}</span>
      ) : (
        users?.map(user => <UserDisplay key={user.id} user={user} />)
      )}
    </div>
  )
}
