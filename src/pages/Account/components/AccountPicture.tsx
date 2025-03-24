import { images } from '../../../constants/SETTINGS'
import { useSettings } from '../../../hooks/useSettings'
import { UserData } from '../models/UserData'

export function AccountPicture (props: { userData: UserData }) {
  const { openModal } = useSettings()

  const handleClick = () => {
    openModal('picture')
  }

  return (
    <button
      onClick={handleClick}
      className='relative cursor-pointer grid place-items-center rounded-full w-[clamp(40px,25vw,100px)] overflow-hidden aspect-square border-orange-crayola border-vibe'
    >
      <img
        title={`${props.userData.name} Profile Picture`}
        className='absolute w-full h-full'
        src={props.userData.imageUrl ?? images.guest}
        alt='Profile'
      />
    </button>
  )
}
