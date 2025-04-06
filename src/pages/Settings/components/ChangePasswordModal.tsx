import { useRef, useState } from 'react'
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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const newPasswordRef = useRef<HTMLInputElement>(null)
  const confirmedNewPasswordRef = useRef<HTMLInputElement>(null)

  const handleChangePassword = async () => {
    if (isLoading) return

    setIsLoading(true)

    const newPassword = newPasswordRef.current?.value
    const confirmedNewPassword = confirmedNewPasswordRef.current?.value
    const isNewPasswordValid = validatePasswords({
      password: newPassword,
      confirmedPassword: confirmedNewPassword
    })

    if (!isNewPasswordValid || !user || !newPassword) {
      setIsLoading(false)
      return
    }

    const passwordChangeSuccess = await user.changePassword({ newPassword })

    if (passwordChangeSuccess) {
      closeModal()
    } else {
      openModal('connection')
    }

    setIsLoading(false)
  }

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

        <Button
          disabled={isLoading}
          text={dictionary.change}
          onClick={handleChangePassword}
        />
      </article>
    </Modal>
  )
}
