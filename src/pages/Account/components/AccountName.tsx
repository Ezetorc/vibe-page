import { EditButton } from './EditButton'
import { CheckIcon, PencilIcon } from '../../../components/Icons'
import { Loading } from '../../../components/Loading'
import { useSettings } from '../../../hooks/useSettings'
import { useAccount } from '../hooks/useAccount'

export function AccountName () {
  const { dictionary } = useSettings()
  const { account, editState, setEditState, handleEdit, accountIsUser } =
    useAccount() 

  if (!account) return <Loading />

  return (
    <div className='flex w-full justify-center'>
      {editState.field === 'name' ? (
        <>
          <EditButton onEdit={handleEdit}>
            <CheckIcon />
          </EditButton>
          <input
            minLength={3}
            maxLength={20}
            className='text-orange-crayola text-center w-full bg-transparent outline-hidden font-poppins-regular text-[clamp(15px,5.5vw,35px)]'
            onChange={event =>
              setEditState({
                field: 'name',
                value: event.target.value
              })
            }
            defaultValue={account.name || dictionary.loading}
          />
        </>
      ) : (
        <>
          {accountIsUser && (
            <EditButton
              onEdit={() =>
                setEditState({ field: 'name', value: account.name })
              }
            >
              <PencilIcon />
            </EditButton>
          )}
          <h2 className='text-orange-crayola w-full text-center bg-transparent font-poppins-regular text-[clamp(15px,5.5vw,35px)]'>
            {account.name || dictionary.loading}
          </h2>
        </>
      )}
    </div>
  )
}
