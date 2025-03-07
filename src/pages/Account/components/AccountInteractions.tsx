import { AccountData } from '../models/AccountData'
import { FollowButton } from './FollowButton'

export function AccountInteractions (props: { accountData: AccountData }) {
  return (
    <div className='flex gap-x-[20px]'>
      {!props.accountData.isUser && (
        <>
          <FollowButton user={props.accountData.user!} />
        </>
      )}
    </div>
  )
}
