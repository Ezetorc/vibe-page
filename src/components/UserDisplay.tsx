import { FollowButton } from './FollowButton'
import { Username } from './Username'
import { useUser } from '../hooks/useUser'
import { UserImage } from './UserImage'
import { User } from '../models/User'

export function UserDisplay (props: {
  user: User | null
}) {
  const { user } = useUser()
  const isLoading = props.user === null
  const isLogged = props.user?.name != user?.name

  return (
    <article className='gap-y-[10px] gap-x-[5px] items-center grid mobile:grid-cols-[2fr_4fr_2fr] desktop:grid-cols-[1fr_4fr_2fr] w-full p-[2%] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
      {isLoading ? (
        <div className='bg-green-400 w-[clamp(100px,100%,200px)] h-[100px] animate-shimmer bg-shimmer' />
      ) : (
        <>
          <UserImage className='w-[clamp(50px,100%,70px)]' user={props.user} />

          <div className='overflow-hidden relative'>
            <Username id={props.user!.id}>{props.user!.name}</Username>
            <div className='pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-gunmetal to-transparent'></div>
          </div>

          {isLogged && <FollowButton following={props.user} />}
        </>
      )}
    </article>
  )
}
