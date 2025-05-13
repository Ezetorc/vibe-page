import { Link } from 'wouter'
import { useSession } from '../hooks/useSession'
import { User } from '../models/User'

export function Username (props: { user?: User | null; className?: string }) {
  const { loggedUser } = useSession()
  const userName = props.user?.name
  const to: string =
    loggedUser?.name === userName ? `/account` : `/account/${props.user?.id}`

  return (
    <>
      {userName && (
        <Link
          className={`${props.className} overflow-ellipsis text-orange-crayola desktop:hover:underline content-end mobile:text-[clamp(8px,1rem,20px)] desktop:text-[clamp(10px,1.5rem,30px)]`}
          to={to}
        >
          {userName}
        </Link>
      )}
    </>
  )
}
