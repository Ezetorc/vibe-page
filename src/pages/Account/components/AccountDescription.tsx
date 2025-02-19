import { EditButton } from './EditButton'
import { CheckIcon, PencilIcon } from '../../../components/Icons'
import { Loading } from '../../../components/Loading'
import { useSettings } from '../../../hooks/useSettings'
import { useAccount } from '../hooks/useAccount'

export function AccountDescription () {
  const { dictionary } = useSettings()
  const { account, editState, setEditState, handleEdit, accountIsUser } =
    useAccount()

  if (!account) return <Loading />

  return (
    <div
      className={`gap-x-[10px] justify-center w-full h-full grid ${
        accountIsUser ? 'grid-cols-[auto_1fr]' : 'grid-cols-[1fr]'
      }`}
    >
      {editState.field === 'description' ? (
        <>
          <EditButton onEdit={handleEdit}>
            <CheckIcon />
          </EditButton>
          <textarea
            minLength={0}
            maxLength={200}
            className='w-[90%] bg-transparent h-[160px] placeholder:text-caribbean-current resize-none outline-hidden break-words text-white text-[clamp(5px,6vw,20px)] font-poppins-regular'
            onChange={event =>
              setEditState({
                field: 'description',
                value: event.target.value
              })
            }
            placeholder={dictionary.myNewDescription}
            defaultValue={account.description || ''}
          />
        </>
      ) : (
        <>
          {accountIsUser && (
            <EditButton
              onEdit={() =>
                setEditState({
                  field: 'description',
                  value: account.description
                })
              }
            >
              <PencilIcon />
            </EditButton>
          )}
          <p className='h-[clamp(160px,auto,320px)] w-[90%] text-white text-[clamp(5px,6vw,20px)] font-poppins-regular break-words whitespace-pre-wrap overflow-hidden overflow-wrap-anywhere'>
            {account.description || (
              <span className='text-caribbean-current'>
                {accountIsUser
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
