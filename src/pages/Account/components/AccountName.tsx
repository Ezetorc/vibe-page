import { EditButton } from './EditButton'
import { CheckIcon, PencilIcon } from '../../../components/Icons'
import { useSettings } from '../../../hooks/useSettings'
import { AccountData } from '../models/AccountData'
import { EditState } from '../models/EditState'

export function AccountName (props: {
  accountData: AccountData
  edit: EditState
}) {
  const { dictionary } = useSettings()

  return (
    <div className='flex w-full justify-center'>
      {props.edit.field === 'name' ? (
        <>
          <EditButton onEdit={props.edit.handle}>
            <CheckIcon />
          </EditButton>
          <input
            minLength={3}
            maxLength={20}
            className='text-orange-crayola text-center content-center w-full bg-transparent outline-hidden font-poppins-regular mobile:text-[clamp(13px,4.5vw,30px)] desktop:text-[clamp(15px,5.5vw,35px)]'
            onChange={event =>
              props.edit.set({
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
                props.edit.set({
                  field: 'name',
                  value: props.accountData.user!.name
                })
              }
            >
              <PencilIcon />
            </EditButton>
          )}
          <h2 className='text-orange-crayola w-full content-center text-center bg-transparent font-poppins-regular mobile:text-[clamp(13px,4.5vw,30px)] desktop:text-[clamp(15px,5.5vw,35px)]'>
            {props.accountData.user!.name}
          </h2>
        </>
      )}
    </div>
  )
}
