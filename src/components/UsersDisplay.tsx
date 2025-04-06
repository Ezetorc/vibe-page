import { User } from '../models/User'
import { UserDisplay } from './UserDisplay'

export function UsersDisplay (props: { users: User[] | null }) {
  return (
    <div className='w-full flex flex-col items-center gap-y-[20px]'>
      {props.users?.map((user, index) => (
        <UserDisplay key={index} user={user} />
      ))}
    </div>
  )
}
