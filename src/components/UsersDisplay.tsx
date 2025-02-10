import { UsersDisplayProps } from "../models/UsersDisplayProps";
import { UserDisplay } from "./UserDisplay";

export function UsersDisplay ({ users }: UsersDisplayProps) {
  return (
    <div className='w-full flex flex-col items-center gap-y-[20px]'>
      {users?.map(user => (
        <UserDisplay key={user.id} user={user} />
      ))}
    </div>
  )
}
