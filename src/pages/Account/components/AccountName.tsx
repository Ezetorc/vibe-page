import { User } from '../../../models/User'

export function AccountName (props: { user: User }) {
  return (
    <h2 className='text-orange-crayola w-full content-center text-center bg-transparent  mobile:text-[clamp(13px,6vw,30px)] desktop:text-[clamp(15px,7vw,35px)]'>
      {props.user.name}
    </h2>
  )
}
