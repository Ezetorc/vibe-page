import { Button } from '../../../components/Button'
import { Modal } from '../../../components/Modal'
import { CloseModalButton } from '../../../components/CloseModalButton'
import { ErrorMessage } from '../../../components/ErrorMessage'
import { useSettings } from '../../../hooks/useSettings'
import { useState } from 'react'
import { useAccountDeleter } from '../hooks/useAccountDeleter'

export default function DeleteAccountModal () {
  const { dictionary } = useSettings()
  const [canDelete, setCanDelete] = useState<boolean>(false)
  const { error, deleteAccount } = useAccountDeleter(canDelete)

  return (
    <Modal>
      <article className='items-center p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(200px,auto,600px)]'>
        <CloseModalButton />

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.areYouSureDelete}
        </h2>

        <form className='w-full flex flex-col gap-y-[30px]'>
          <div className='flex gap-x-5 items-center'>
            <input
              onChange={event => setCanDelete(event.currentTarget.checked)}
              type='checkbox'
              id='irreversible-action'
              className='peer hidden'
            />
            <label
              htmlFor='irreversible-action'
              className='relative w-6 h-6 flex items-center justify-center border-2 border-white rounded-full cursor-pointer peer-checked:bg-orange-crayola peer-checked:border-orange-crayola'
            >
              <span className='absolute w-3 h-3 bg-white rounded-full opacity-0 scale-0 peer-checked:opacity-100 peer-checked:scale-100'></span>
            </label>
            <label className='font-poppins-light' htmlFor='irreversible-action'>
              {dictionary.irreversibleAction}
            </label>
          </div>

          <ErrorMessage value={error} />

          <Button
            classname='w-full'
            text={dictionary.deleteAccount}
            onClick={deleteAccount}
          />
        </form>
      </article>
    </Modal>
  )
}
