import { LoadSpinner } from '../../../components/LoadSpinner'
import { useSettings } from '../../../hooks/useSettings'
import { AccountData } from '../models/AccountData'

export function AccountInfo (props: { accountData: AccountData }) {
  const { dictionary } = useSettings()

  return (
    <article className='flex justify-center gap-x-[4%]'>
      <div className='flex flex-col items-center'>
        <span className='text-verdigris font-poppins-semibold text-[clamp(10px,5vw,30px)]'>
          {props.accountData.postsAmount >= 0 ? (
            props.accountData.postsAmount
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
          {props.accountData.followersAmount >= 0 ? (
            props.accountData.followersAmount
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
          {props.accountData.followingAmount >= 0 ? (
            props.accountData.followingAmount
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
