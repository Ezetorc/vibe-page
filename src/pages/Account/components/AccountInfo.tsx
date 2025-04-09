import { LoadSpinner } from '../../../components/LoadSpinner'
import { useSettings } from '../../../hooks/useSettings'
import { User } from '../../../models/User'

export function AccountInfo (props: { user: User }) {
  const { dictionary } = useSettings()

  if (
    props.user.postsAmount == null ||
    props.user.postsAmount < 0 ||
    props.user.followersAmount == null ||
    props.user.followersAmount < 0 ||
    props.user.followingAmount == null ||
    props.user.followingAmount < 0
  ) {
    return null
  }

  return (
    <article className='flex justify-center gap-x-[4%]'>
      <div className='flex flex-col items-center'>
        <span className='text-verdigris font-poppins-semibold text-[clamp(10px,5vw,30px)]'>
          {props.user.postsAmount >= 0 ? (
            props.user.postsAmount
          ) : (
            <LoadSpinner />
          )}
        </span>
        <span className='text-verdigris font-poppins-light text-[clamp(10px,5vw,14px)]'>
          {dictionary.posts}
        </span>
      </div>

      <div className='flex flex-col items-center'>
        <span className='text-verdigris font-poppins-semibold text-[clamp(10px,5vw,30px)]'>
          {props.user.followersAmount >= 0 ? (
            props.user.followersAmount
          ) : (
            <LoadSpinner />
          )}
        </span>
        <span className='text-verdigris font-poppins-light text-[clamp(10px,5vw,14px)]'>
          {dictionary.followers}
        </span>
      </div>

      <div className='flex flex-col items-center'>
        <span className='text-verdigris font-poppins-semibold text-[clamp(10px,5vw,30px)]'>
          {props.user.followingAmount >= 0 ? (
            props.user.followingAmount
          ) : (
            <LoadSpinner />
          )}
        </span>
        <span className='text-verdigris font-poppins-light text-[clamp(10px,5vw,14px)]'>
          {dictionary.following}
        </span>
      </div>
    </article>
  )
}
