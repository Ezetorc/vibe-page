import { UserData } from '../models/UserData'
import { FollowButton } from '../../../components/FollowButton'

export function AccountInteractions (props: { userData: UserData }) {
  return (
    <div className='flex gap-x-[20px]'>
      {!props.userData.isLogged && (
        <>
          <FollowButton following={props.userData.user} />
        </>
      )}
    </div>
  )
}
