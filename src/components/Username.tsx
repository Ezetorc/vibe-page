import { Link } from 'react-router'
import { UsernameProps } from '../models/Props/UsernameProps'
import { useUser } from '../hooks/useUser'

export function Username (props: UsernameProps) {
  const { user } = useUser()
  const username = props.children?.toString()
  const to: string =
    user?.name === username ? `/account/me` : `/account/${username}`

  return (
    <>
      {username && (
        <Link
          className={`${props.className} text-orange-crayola w-full hover:underline font-poppins-regular content-end text-[clamp(10px,1.5rem,30px)]`}
          to={to}
        >
          {username}
        </Link>
      )}
    </>
  )
}
