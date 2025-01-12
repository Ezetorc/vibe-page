import { format, parse } from '@formkit/tempo'
import { User } from '../models/User'

export function UserDisplay ({ user }: { user: User }) {
  const storedDate: string = user.createdAt
  const parsedDate: Date = parse(storedDate, 'yyyy-MM-dd HH:mm:ss')
  const formattedDate: string = format(parsedDate, 'long')

  return (
    <article className='flex flex-col w-[clamp(300px,100%,700px)] h-[300px] py-[10px] px-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
      <div className='gap-x-[20px] grid h-full grid-cols-[1fr,2fr] grid-rows-[1fr,1fr]'>
        <img className='self-center mb-[10px] justify-self-end row-[span_2] rounded-full w-[clamp(70px,50%,90px)] aspect-square bg-orange-crayola' />

        <h3 className='text-orange-crayola font-poppins-regular content-end text-[clamp(20px,7vw,25px)]'>
          {user?.name || 'Loading...'}
        </h3>

        <span className='text-caribbean-current font-poppins-light content-start text-[clamp(10px,4vw,20px)]'>
          {`Joined ${formattedDate}`}
        </span>
      </div>

      <div className='flex h-full flex-col'>
        <p className='break-words text-white text-[clamp(5px,6vw,20px)] font-poppins-regular'>
          {user.description}
        </p>
      </div>
    </article>
  )
}
