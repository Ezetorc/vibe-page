import { Link } from 'react-router'
import { UsernameProps } from '../models/Props/UsernameProps'
import { Loading } from './Loading'

export function Username (props: UsernameProps) {
  const username = props.children?.toString()

  return (
    <>
      {username ? (
        <Link
          className='text-orange-crayola w-full hover:underline font-poppins-regular content-end text-[clamp(10px,1.5rem,30px)]'
          to={`/account/${username}`}
        >
          {username}
        </Link>
      ) : (
        <Loading />
      )}
    </>
  )
}
