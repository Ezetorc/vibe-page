import { useLoggedUser } from '../../../hooks/useLoggedUser'
import { useSettings } from '../../../hooks/useSettings'
import { User } from '../../../models/User'

export function AccountDate (props: { user: User }) {
  const { dictionary } = useSettings()
  const { loggedUser } = useLoggedUser()
  const isLogged = loggedUser?.id === props.user.id

  return (
    <span className='text-caribbean-current text-center w-full font-poppins-light text-[clamp(10px,4rem,20px)]'>
      {`${isLogged ? dictionary.youJoined : dictionary.joined} ${
        props.user.date
      }`}
    </span>
  )
}
