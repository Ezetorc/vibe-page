import { UserImage } from '../../../components/UserImage'
import { useSettings } from '../../../hooks/useSettings'
import { User } from '../../../models/User'

export function AccountPicture (props: { user: User }) {
  const { openModal, dictionary } = useSettings()

  const handleClick = () => {
    openModal('picture')
  }

  return (
    <button
      onClick={handleClick}
      className='relative cursor-pointer grid place-items-center w-[clamp(40px,25vw,100px)] overflow-hidden rounded-user-image aspect-square border-vibe border-caribbean-current'
    >
      <UserImage
        title={dictionary.changeProfileImage}
        className='absolute w-full h-full rounded-none aspect-auto border-none'
        user={props.user}
      />
    </button>
  )
}
