import { useMemo } from 'react'
import { useSettings } from '../hooks/useSettings'
import { useUser } from '../hooks/useUser'
import { FollowButton } from '../pages/Account/components/FollowButton'
import { Username } from './Username'
import { UserDisplayProps } from '../models/Props/UserDisplayProps'

export function UserDisplay (props: UserDisplayProps) {
  const { dictionary } = useSettings()
  const { user } = useUser()
  const accountIsUser = useMemo(
    () => user?.id === props.user.id,
    [user, props.user]
  )

  return (
    <article className='gap-y-[10px] flex flex-col justify-center w-[clamp(300px,100%,700px)] h-[clamp(300px,auto,400px)] p-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
      <div className='gap-x-[20px] justify-center grid grid-cols-[1fr_2fr] grid-rows-[1fr_1fr]'>
        <img
          title={`${props.user?.name} Profile Picture`}
          className='self-center mb-[10px] justify-self-end row-[span_2] rounded-full w-[clamp(70px,50%,90px)] aspect-square border-vibe border-orange-crayola'
          src={props.user.imageUrl ?? 'src/assets/images/guest_user.jpg'}
          alt='Profile'
        />
        <div className='flex items-end'>
          <Username>{props.user.name}</Username>
        </div>

        <span className='text-caribbean-current font-poppins-light text-[clamp(10px,4vw,20px)]'>
          {`${dictionary.joined} ${props.user.getDate()}`}
        </span>
      </div>

      <p className='h-[clamp(50px,auto,160px)] w-full text-white text-[clamp(5px,6vw,20px)] font-poppins-regular break-words whitespace-pre-wrap overflow-hidden overflow-wrap-anywhere'>
        {props.user.description || (
          <span className='text-caribbean-current'>
            {accountIsUser
              ? dictionary.youDontHaveDescription
              : dictionary.thisUserHasnotDescription}
          </span>
        )}
      </p>

      <div className='flex gap-x-[20px]'>
        {!accountIsUser && <FollowButton user={props.user} />}
      </div>
    </article>
  )
}
