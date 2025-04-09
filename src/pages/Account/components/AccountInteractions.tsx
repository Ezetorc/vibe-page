import { FollowButton } from '../../../components/FollowButton'
import { useLoggedUser } from '../../../hooks/useLoggedUser'
import { User } from '../../../models/User'

export function AccountInteractions (props: { user: User }) {
  const { loggedUser } = useLoggedUser()
  const isLogged = loggedUser?.id == props.user.id

  return (
    <div className='flex gap-x-[20px]'>
      {!isLogged && (
        <>
          <FollowButton following={props.user} />
        </>
      )}
    </div>
  )
}
