import { Loading } from '../../../components/Loading'
import { Username } from '../../../components/Username'
import { useUser } from '../../../hooks/useUser'

export function PostOwner () {
  const { user } = useUser()

  return (
    <>
      {user ? (
        <header className='w-full h-full flex items-center gap-x-[10px] my-[20px]'>
          <img className='rounded-full w-[50px] aspect-square bg-orange-crayola' />
          <Username>{user.name}</Username>
        </header>
      ) : (
        <Loading />
      )}
    </>
  )
}
