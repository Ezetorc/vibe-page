import { Loading } from '../../../components/Loading'
import { useAccount } from '../hooks/useAccount'
import { FollowButton } from './FollowButton'

export function AccountInteractions () {
  const { account, accountIsUser } = useAccount()

  if (!account) return <Loading />

  return (
    <div className='flex gap-x-[20px]'>
      {!accountIsUser && (
        <>
          <FollowButton user={account} />
        </>
      )}
    </div>
  )
}
