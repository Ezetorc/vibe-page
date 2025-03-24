import { UserData } from '../models/UserData'
import { FollowButton } from '../../../components/FollowButton'
import { useUser } from '../../../hooks/useUser'

export function AccountInteractions (props: { userData: UserData }) {
  const { user } = useUser()

  if (!props.userData.id || !user?.id) return

  return (
    <div className='flex gap-x-[20px]'>
      {!props.userData.isLogged && (
        <>
          <FollowButton followingId={props.userData.id} followerId={user.id} />
        </>
      )}
    </div>
  )
}
