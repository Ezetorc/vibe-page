import { useSettings } from '../hooks/useSettings'
import { FollowButton } from './FollowButton'
import { Username } from './Username'
import { UserDisplayProps } from '../models/Props/UserDisplayProps'
import { useUserData } from '../hooks/useUserData'

export function UserDisplay (props: UserDisplayProps) {
  const { dictionary } = useSettings()
  const { userData, isLoading, isError} = useUserData(props.user.name)

  if (isLoading || isError) return

  return (
    <article className='gap-y-[10px] flex flex-col justify-center w-[clamp(300px,100%,700px)] h-[clamp(300px,auto,400px)] p-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
      <div className='gap-x-[20px] justify-center grid grid-cols-[1fr_2fr] grid-rows-[1fr_1fr]'>
        <img
          title={`${userData.name} Profile Picture`}
          className='self-center mb-[10px] justify-self-end row-[span_2] rounded-full w-[clamp(70px,50%,90px)] aspect-square border-vibe border-orange-crayola'
          src={userData.imageUrl ?? 'src/assets/images/guest_user.jpg'}
          alt='Profile'
        />
        <div className='flex items-end'>
          <Username>{userData.name}</Username>
        </div>

        <span className='text-caribbean-current font-poppins-light text-[clamp(10px,4vw,20px)]'>
          {`${dictionary.joined} ${userData.date}`}
        </span>
      </div>

      <p className='h-[clamp(50px,auto,160px)] w-full text-white text-[clamp(5px,6vw,20px)] font-poppins-regular break-words whitespace-pre-wrap overflow-hidden overflow-wrap-anywhere'>
        {userData.description || (
          <span className='text-caribbean-current'>
            {userData.isLogged
              ? dictionary.youDontHaveDescription
              : dictionary.thisUserHasnotDescription}
          </span>
        )}
      </p>

      <div className='flex gap-x-[20px]'>
        {!userData.isLogged && <FollowButton userId={userData.id!} />}
      </div>
    </article>
  )
}
