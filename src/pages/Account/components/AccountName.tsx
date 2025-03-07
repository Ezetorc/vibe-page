import { EditButton } from './EditButton'
import { CheckIcon, PencilIcon } from '../../../components/Icons'
import { useSettings } from '../../../hooks/useSettings'
import { AccountData } from '../models/AccountData'

export function AccountName (props: { accountData: AccountData }) {
  const { dictionary } = useSettings()

  return (
    <div className='flex w-full justify-center'>
      {props.accountData.editState.field === 'name' ? (
        <>
          <EditButton onEdit={props.accountData.handleEdit}>
            <CheckIcon />
          </EditButton>
          <input
            minLength={3}
            maxLength={20}
            className='text-orange-crayola text-center w-full bg-transparent outline-hidden font-poppins-regular text-[clamp(15px,5.5vw,35px)]'
            onChange={event =>
              props.accountData.setEditState({
                field: 'name',
                value: event.target.value
              })
            }
            defaultValue={props.accountData.user!.name || dictionary.loading}
          />
        </>
      ) : (
        <>
          {props.accountData.isUser && (
            <EditButton
              onEdit={() =>
                props.accountData.setEditState({
                  field: 'name',
                  value: props.accountData.user!.name
                })
              }
            >
              <PencilIcon />
            </EditButton>
          )}
          <h2 className='text-orange-crayola w-full text-center bg-transparent font-poppins-regular text-[clamp(15px,5.5vw,35px)]'>
            {props.accountData.user!.name}
          </h2>
        </>
      )}
    </div>
  )
}
