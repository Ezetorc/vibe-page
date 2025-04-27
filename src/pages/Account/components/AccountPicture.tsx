import { UserImage } from '../../../components/UserImage'
import { User } from '../../../models/User'

export function AccountPicture (props: { user: User }) {
  return (
    <UserImage
      className='grid place-items-center w-[clamp(40px,25vw,100px)] overflow-hidden rounded-user-image aspect-square border-vibe border-caribbean-current h-full'
      user={props.user}
    />
  )
}
