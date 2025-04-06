import { Link } from 'react-router'
import { useUser } from '../hooks/useUser'
import { ReactNode } from 'react'

export function Username (props: {
  children: ReactNode
  id: number | null | undefined
  className?: string
}) {
  const { user } = useUser()
  const username = props.children?.toString()
  const to: string =
    user?.name === username ? `/account` : `/account/${props.id}`

  return (
    <>
      {username && (
        <Link
          className={`${props.className} overflow-ellipsis text-orange-crayola w-full hover:underline  content-end text-[clamp(10px,1.5rem,30px)]`}
          to={to}
        >
          {username}
        </Link>
      )}
    </>
  )
}
