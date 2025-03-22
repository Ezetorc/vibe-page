import { useSettings } from '../../../hooks/useSettings'
import { UserData } from '../models/UserData'

export function AccountDate (props: { userData: UserData }) {
  const { dictionary } = useSettings()

  return (
    <span className='text-caribbean-current text-center w-full font-poppins-light text-[clamp(10px,4rem,20px)]'>
      {`${props.userData.isLogged ? dictionary.youJoined : dictionary.joined} ${
        props.userData.date
      }`}
    </span>
  )
}
