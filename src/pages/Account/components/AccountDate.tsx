import { Loading } from '../../../components/Loading'
import { useSettings } from '../../../hooks/useSettings'
import { useAccount } from '../hooks/useAccount'

export function AccountDate () {
  const { dictionary } = useSettings()
  const { account, accountIsUser } = useAccount()

  if (!account) return <Loading />

  return (
    <span className='text-caribbean-current text-center w-full font-poppins-light text-[clamp(10px,4rem,20px)]'>
      {accountIsUser ? dictionary.youJoined : dictionary.joined}{' '}
      {account.getDate()}
    </span>
  )
}
