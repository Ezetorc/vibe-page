import { FollowButton } from '../../../components/FollowButton'
import { useSession } from '../../../hooks/useSession'
import { User } from '../../../models/User'

export function AccountFollow (props: { user: User }) {
  const { loggedUser } = useSession()
  const isLogged = loggedUser?.id == props.user.id

  return (
    <div className='flex w-full gap-x-[20px]'>
      {!isLogged && (
        <>
          <FollowButton following={props.user} />
        </>
      )}
    </div>
  )
}
