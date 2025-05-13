import { useState } from 'react'
import { Button } from '../../../components/Button'
import { FormInput } from '../../../components/FormInput'
import { Modal } from '../../../components/Modal'
import { useSettings } from '../../../hooks/useSettings'
import { CloseModalButton } from '../../../components/CloseModalButton'
import { ErrorMessage } from '../../../components/ErrorMessage'
import { usePasswordChanger } from '../hooks/usePasswordChanger'

export default function ChangePasswordModal () {
  const { dictionary } = useSettings()
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmedNewPassword, setConfirmedNewPassword] = useState<string>('')
  const { error, isLoading, changePassword } = usePasswordChanger(
    newPassword,
    confirmedNewPassword
  )

  return (
    <Modal>
      <article className='items-center p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(200px,auto,600px)]'>
        <CloseModalButton />

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.changePassword}
        </h2>

        <FormInput
          min={6}
          max={30}
          type='password'
          onChange={event => setNewPassword(event.currentTarget.value)}
          placeholder={dictionary.password}
          className='placeholder:text-verdigris p-[5px]'
        />
        <FormInput
          min={6}
          max={30}
          onChange={event => setConfirmedNewPassword(event.currentTarget.value)}
          type='password'
          placeholder={dictionary.confirmPassword}
          className='placeholder:text-verdigris p-[5px]'
        />

        <ErrorMessage value={error} />

        <Button
          classname='w-full'
          loading={isLoading}
          text={dictionary.change}
          onClick={changePassword}
        />
      </article>
    </Modal>
  )
}
