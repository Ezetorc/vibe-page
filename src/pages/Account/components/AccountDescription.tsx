import { useSettings } from '../../../hooks/useSettings'
import { UserData } from '../models/UserData'

export function AccountDescription (props: { userData: UserData }) {
  const { dictionary } = useSettings()

  return (
    <div
      className={`gap-x-[10px] justify-center w-full h-fit`}
    >
      <p className='h-[clamp(160px,auto,320px)] text-center w-full text-white text-[clamp(5px,6vw,20px)]  break-words whitespace-pre-wrap overflow-hidden overflow-wrap-anywhere'>
        {props.userData.description ?? (
          <span className='text-caribbean-current'>
            {props.userData.isLogged
              ? dictionary.youDontHaveDescription
              : dictionary.thisUserHasnotDescription}
          </span>
        )}
      </p>
    </div>
  )
}
