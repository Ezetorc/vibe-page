import { Link } from 'wouter'
import { useLoggedUser } from '../hooks/useLoggedUser'
import { User } from '../models/User'

export function Username (props: { user: User | null; className?: string }) {
  const { loggedUser } = useLoggedUser()
  const userName = props.user?.name
  const to: string =
    loggedUser?.name === userName ? `/account` : `/account/${props.user?.id}`

  return (
    <>
      {userName && (
        <Link
          className={`${props.className} overflow-ellipsis text-orange-crayola w-full hover:underline content-end text-[clamp(10px,1.5rem,30px)]`}
          to={to}
        >
          {userName}
        </Link>
      )}
    </>
  )
}
