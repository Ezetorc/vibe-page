import { useSession } from '../../../hooks/useSession'
import { useSettings } from '../../../hooks/useSettings'
import { User } from '../../../models/User'

export function AccountDescription (props: { user: User }) {
  const { dictionary } = useSettings()
  const { loggedUser } = useSession()
  const isLogged = loggedUser?.id === props.user.id

  return (
    <div className={`gap-x-[10px] justify-center w-full h-fit`}>
      <p className='h-[clamp(160px,auto,320px)] text-center w-full text-white text-[clamp(5px,6vw,20px)]  break-words whitespace-pre-wrap overflow-hidden overflow-wrap-anywhere'>
        {props.user.description ?? (
          <span className='text-caribbean-current'>
            {isLogged
              ? dictionary.youDontHaveDescription
              : dictionary.thisUserHasnotDescription}
          </span>
        )}
      </p>
    </div>
  )
}
