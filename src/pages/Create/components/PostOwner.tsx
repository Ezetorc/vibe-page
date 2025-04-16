import { UserImage } from '../../../components/UserImage'
import { Username } from '../../../components/Username'
import { useSession } from '../../../hooks/useSession'

export function PostOwner () {
  const { loggedUser } = useSession()

  return (
    <header className='w-full flex mobile:flex desktop:flex-row items-center gap-x-[10px] my-[20px]'>
      <UserImage
        user={loggedUser}
        className='desktop:w-[clamp(40px,5vw,60px)] mobile:w-[clamp(40px,20vw,60px)]'
      />

      <Username
        user={loggedUser}
        className='mobile:text-[clamp(10px,1.5rem,17px)] mobile:text-center desktop:text-left desktop:text-[clamp(10px,1.5rem,30px)]'
      />
    </header>
  )
}
