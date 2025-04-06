import { UserImage } from '../../../components/UserImage'
import { Username } from '../../../components/Username'
import { useUser } from '../../../hooks/useUser'

export function PostOwner () {
  const { user, isSessionActive } = useUser()

  return (
    <header className='w-full flex mobile:flex desktop:flex-row items-center gap-x-[10px] my-[20px]'>
      {isSessionActive() ? (
        <>
          <UserImage
            user={user}
            className='desktop:w-[clamp(40px,5vw,60px)] mobile:w-[clamp(40px,20vw,60px)]'
          />

          <Username
            id={user!.id}
            className='mobile:text-[clamp(10px,1.5rem,17px)] mobile:text-center desktop:text-left desktop:text-[clamp(10px,1.5rem,30px)]'
          >
            {user!.name}
          </Username>
        </>
      ) : (
        <div className='w-full h-full animate-shimmer bg-shimmer'></div>
      )}
    </header>
  )
}
