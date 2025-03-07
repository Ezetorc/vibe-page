import { useSettings } from '../../../hooks/useSettings'
import { AccountData } from '../models/AccountData'

export function AccountDate (props: { accountData: AccountData }) {
  const { dictionary } = useSettings()

  return (
    <span className='text-caribbean-current text-center w-full font-poppins-light text-[clamp(10px,4rem,20px)]'>
      {`${
        props.accountData.isUser ? dictionary.youJoined : dictionary.joined
      } ${props.accountData.user!.getDate()}`}
    </span>
  )
}
