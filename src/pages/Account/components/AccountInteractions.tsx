import { Loading } from '../../../components/Loading'
import { useAccount } from '../hooks/useAccount'
import { FollowButton } from './FollowButton'

export function AccountInteractions () {
  const account = useAccount()

  if (!account.user) return <Loading />

  return (
    <div className='flex gap-x-[20px]'>
      {!account.isUser && (
        <>
          <FollowButton user={account.user} />
        </>
      )}
    </div>
  )
}
