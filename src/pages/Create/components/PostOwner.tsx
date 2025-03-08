import { Loading } from '../../../components/Loading'
import { Username } from '../../../components/Username'
import { useUser } from '../../../hooks/useUser'

export function PostOwner () {
  const { user } = useUser()

  return (
    <>
      {user ? (
        <header className='w-full h-full flex mobile:flex-col desktop:flex-row items-center gap-x-[10px] my-[20px]'>
          <img
            title={`${user.name} Profile Picture`}
            className='rounded-full desktop:w-[clamp(40px,5vw,60px)] mobile:w-[clamp(40px,20vw,60px)] aspect-square border-orange-crayola border-vibe'
            src={user.imageUrl ?? 'src/assets/images/guest_user.jpg'}
            alt='Profile'
          />
          <Username className='mobile:text-[clamp(10px,1.5rem,17px)] mobile:text-center desktop:text-left desktop:text-[clamp(10px,1.5rem,30px)]'>{user.name}</Username>
        </header>
      ) : (
        <Loading />
      )}
    </>
  )
}
