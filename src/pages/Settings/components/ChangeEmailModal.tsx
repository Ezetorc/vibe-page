import { Button } from '../../../components/Button'
import { FormInput } from '../../../components/FormInput'
import { Modal } from '../../../components/Modal'
import { useSettings } from '../../../hooks/useSettings'
import { CloseModalButton } from '../../../components/CloseModalButton'
import { ErrorMessage } from '../../../components/ErrorMessage'
import { useState } from 'react'
import { useEmailChanger } from '../hooks/useEmailChanger'

export default function ChangeEmailModal () {
  const { dictionary } = useSettings()
  const [newEmail, setNewEmail] = useState<string>('')
  const { error, isLoading, changeEmail } = useEmailChanger(newEmail)

  return (
    <Modal>
      <article className='items-center p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(200px,auto,600px)]'>
        <CloseModalButton />

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.changeEmail}
        </h2>

        <FormInput
          type='email'
          min={1}
          max={31}
          onChange={event => setNewEmail(event.currentTarget.value)}
          placeholder={dictionary.myNewEmail}
          className='placeholder:text-verdigris p-[5px]'
        />

        <ErrorMessage value={error} />

        <Button
          classname='w-full'
          loading={isLoading}
          text={dictionary.change}
          onClick={changeEmail}
        />
      </article>
    </Modal>
  )
}
