import { LoadSpinner } from '../../../components/LoadSpinner'
import { useSettings } from '../../../hooks/useSettings'
import { UserData } from '../models/UserData'

export function AccountInfo (props: { userData: UserData }) {
  const { dictionary } = useSettings()

  if (
    props.userData.postsAmount == null ||
    props.userData.postsAmount < 0 ||
    props.userData.followersAmount == null ||
    props.userData.followersAmount < 0 ||
    props.userData.followingAmount == null ||
    props.userData.followingAmount < 0
  ) {
    return null
  }

  return (
    <article className='flex justify-center gap-x-[4%]'>
      <div className='flex flex-col items-center'>
        <span className='text-verdigris font-poppins-semibold text-[clamp(10px,5vw,30px)]'>
          {props.userData.postsAmount >= 0 ? (
            props.userData.postsAmount
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
          {props.userData.followersAmount >= 0 ? (
            props.userData.followersAmount
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
          {props.userData.followingAmount >= 0 ? (
            props.userData.followingAmount
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
