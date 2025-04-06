import { UserImage } from '../../../components/UserImage'
import { useSettings } from '../../../hooks/useSettings'
import { UserData } from '../models/UserData'

export function AccountPicture (props: { userData: UserData }) {
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
        user={props.userData.user}
      />
    </button>
  )
}
