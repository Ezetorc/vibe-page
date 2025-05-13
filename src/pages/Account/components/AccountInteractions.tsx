import { LoadSpinner } from '../../../components/LoadSpinner'
import { useSettings } from '../../../hooks/useSettings'
import { User } from '../../../models/User'
import { useUserInteractions } from '../hooks/useUserInteractions'

export function AccountInteractions (props: { user: User }) {
  const { dictionary } = useSettings()
  const { postsAmount, followersAmount, followingAmount, isLoading } =
    useUserInteractions(props.user)

  return (
    <article className='flex justify-center gap-x-[4%]'>
      {isLoading ? (
        <LoadSpinner />
      ) : (
        <>
          <div className='flex flex-col items-center'>
            <span className='text-verdigris font-poppins-semibold text-[clamp(10px,5vw,30px)]'>
              {postsAmount}
            </span>
            <span className='text-verdigris font-poppins-light text-[clamp(10px,5vw,14px)]'>
              {dictionary.posts}
            </span>
          </div>

          <div className='flex flex-col items-center'>
            <span className='text-verdigris font-poppins-semibold text-[clamp(10px,5vw,30px)]'>
              {followersAmount}
            </span>
            <span className='text-verdigris font-poppins-light text-[clamp(10px,5vw,14px)]'>
              {dictionary.followers}
            </span>
          </div>

          <div className='flex flex-col items-center'>
            <span className='text-verdigris font-poppins-semibold text-[clamp(10px,5vw,30px)]'>
              {followingAmount}
            </span>
            <span className='text-verdigris font-poppins-light text-[clamp(10px,5vw,14px)]'>
              {dictionary.following}
            </span>
          </div>
        </>
      )}
    </article>
  )
}
