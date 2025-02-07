import { User } from '../models/User'
import { useSettings } from '../hooks/useSettings'
import { Link } from 'react-router'

export function UserDisplay ({ user }: { user: User }) {
  const { dictionary } = useSettings()
  const userDate: string = user.getDate()

  return (
    <article className='flex flex-col w-[clamp(300px,100%,700px)] h-[clamp(300px,auto,400px)] p-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
      <div className='gap-x-[20px] grid h-full grid-cols-[1fr,2fr] grid-rows-[1fr,1fr]'>
        <img className='self-center mb-[10px] justify-self-end row-[span_2] rounded-full w-[clamp(70px,50%,90px)] aspect-square bg-orange-crayola' />

        {user ? (
          <Link
            className='text-orange-crayola font-poppins-regular content-end text-[clamp(20px,7vw,25px)]'
            to={`/account/${user.name}`}
          >{user.name}</Link>
        ) : (
          <h3>{dictionary.loading?.value}</h3>
        )}

        <span className='text-caribbean-current font-poppins-light content-start text-[clamp(10px,4vw,20px)]'>
          {`${dictionary.joined?.value} ${userDate}`}
        </span>
      </div>

      <div className='flex h-full flex-col'>
        {user.description ? (
          <p className='break-words text-white text-[clamp(5px,6vw,20px)] font-poppins-regular'>
            {user.description}
          </p>
        ) : (
          <p className='break-words text-verdigris text-[clamp(5px,6vw,20px)] font-poppins-regular'>
            {dictionary.thisUserHasnotDescription?.value}
          </p>
        )}
      </div>
    </article>
  )
}
