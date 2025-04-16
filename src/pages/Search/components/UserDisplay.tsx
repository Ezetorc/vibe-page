import { FollowButton } from '../../../components/FollowButton'
import { Username } from '../../../components/Username'
import { UserImage } from '../../../components/UserImage'
import { User } from '../../../models/User'
import { useSession } from '../../../hooks/useSession'

export function UserDisplay (props: { user: User | null }) {
  const { loggedUser } = useSession()
  const isLogged = props.user?.name != loggedUser?.name

  return (
    <article className='gap-y-[10px] gap-x-[5px] animate-appear-from-top items-center grid mobile:grid-cols-[2fr_4fr_2fr] desktop:grid-cols-[1fr_4fr_2fr] w-full p-[2%] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
      <UserImage className='w-[clamp(50px,100%,70px)]' user={props.user} />

      <div className='overflow-hidden relative'>
        <Username user={props.user} />
        <div className='pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-gunmetal to-transparent'></div>
      </div>

      {isLogged && <FollowButton following={props.user} />}
    </article>
  )
}
