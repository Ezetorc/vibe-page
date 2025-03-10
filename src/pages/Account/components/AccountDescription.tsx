import { EditButton } from './EditButton'
import { CheckIcon, PencilIcon } from '../../../components/Icons'
import { useSettings } from '../../../hooks/useSettings'
import { AccountData } from '../models/AccountData'

export function AccountDescription (props: { accountData: AccountData}) {
  const { dictionary } = useSettings()

  return (
    <div
      className={`gap-x-[10px] justify-center w-full h-full grid ${
        props.accountData.isUser ? 'grid-cols-[auto_1fr]' : 'grid-cols-[1fr]'
      }`}
    >
      {props.accountData.editState.field === 'description' ? (
        <>
          <EditButton onEdit={props.accountData.handleEdit}>
            <CheckIcon />
          </EditButton>
          <textarea
            minLength={0}
            maxLength={200}
            className='w-[90%] bg-transparent h-[160px] placeholder:text-caribbean-current resize-none outline-hidden break-words text-white text-[clamp(5px,6vw,20px)] font-poppins-regular'
            onChange={event =>
              props.accountData.setEditState({
                field: 'description',
                value: event.target.value
              })
            }
            placeholder={dictionary.myNewDescription}
            defaultValue={props.accountData.user!.description || ''}
          />
        </>
      ) : (
        <>
          {props.accountData.isUser && (
            <EditButton
              onEdit={() =>
                props.accountData.setEditState({
                  field: 'description',
                  value: props.accountData.user!.description ?? ''
                })
              }
            >
              <PencilIcon />
            </EditButton>
          )}
          <p className='h-[clamp(160px,auto,320px)] w-[90%] text-white text-[clamp(5px,6vw,20px)] font-poppins-regular break-words whitespace-pre-wrap overflow-hidden overflow-wrap-anywhere'>
            {props.accountData.user!.description || (
              <span className='text-caribbean-current'>
                {props.accountData.isUser
                  ? dictionary.youDontHaveDescription
                  : dictionary.thisUserHasnotDescription}
              </span>
            )}
          </p>
        </>
      )}
    </div>
  )
}
