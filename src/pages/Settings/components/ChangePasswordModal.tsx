import { useRef } from 'react'
import { Button } from '../../../components/Button'
import { FormInput } from '../../../components/FormInput'
import { Modal } from '../../../components/Modal'
import { useSettings } from '../../../hooks/useSettings'
import { useUser } from '../../../hooks/useUser'
import { useValidation } from '../../../hooks/useValidation'
import { CloseModalButton } from '../../../components/CloseModalButton'

export function ChangePasswordModal () {
  const { user } = useUser()
  const { validatePasswords, errorMessage } = useValidation()
  const { openModal, closeModal, dictionary } = useSettings()
  const newPasswordRef = useRef<HTMLInputElement>(null)
  const confirmedNewPasswordRef = useRef<HTMLInputElement>(null)

  const handleChangePassword = async () => {
    const newPassword = newPasswordRef.current?.value
    const confirmedNewPassword = confirmedNewPasswordRef.current?.value
    const isNewPasswordValid = validatePasswords({
      password: newPassword,
      confirmedPassword: confirmedNewPassword
    })

    if (!isNewPasswordValid || !user || !newPassword) return

    const passwordChange = await user.changePassword({ newPassword })

    if (passwordChange.success) {
      closeModal()
    } else {
      openModal("connection")
    }
  }

  return (
    <Modal>
      <article className='items-center p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(200px,auto,600px)]'>
        <CloseModalButton />

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.change} {dictionary.password}
        </h2>

        <FormInput
          min={6}
          max={30}
          reference={newPasswordRef}
          type='password'
          placeholder={dictionary.password}
          className='placeholder:text-verdigris p-[5px]'
        />
        <FormInput
          min={6}
          max={30}
          reference={confirmedNewPasswordRef}
          type='password'
          placeholder={dictionary.confirmPassword}
          className='placeholder:text-verdigris p-[5px]'
        />

        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

        <Button text={dictionary.change} onClick={handleChangePassword} />
      </article>
    </Modal>
  )
}
