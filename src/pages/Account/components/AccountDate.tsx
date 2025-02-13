import { Loading } from '../../../components/Loading'
import { useSettings } from '../../../hooks/useSettings'
import { useAccount } from '../hooks/useAccount'

export function AccountDate () {
  const { dictionary } = useSettings()
  const { account } = useAccount()

  if (!account) return <Loading />

  return (
    <span className='text-caribbean-current font-poppins-light text-[clamp(10px,4vw,20px)]'>
      {`${dictionary.joined} ${account.getDate()}`}
    </span>
  )
}
