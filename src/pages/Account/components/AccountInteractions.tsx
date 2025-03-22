import { UserData } from '../models/UserData'
import { FollowButton } from '../../../components/FollowButton'

export function AccountInteractions (props: { userData: UserData }) {
  if (!props.userData.id) return

  return (
    <div className='flex gap-x-[20px]'>
      {!props.userData.isLogged && (
        <>
          <FollowButton userId={props.userData.id} />
        </>
      )}
    </div>
  )
}
