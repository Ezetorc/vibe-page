import { useRef } from 'react'
import { Button } from '../../../components/Button'
import { FormInput } from '../../../components/FormInput'
import { Modal } from '../../../components/Modal'
import { useSettings } from '../../../hooks/useSettings'
import { useUser } from '../../../hooks/useUser'
import { useValidation } from '../../../hooks/useValidation'
import { CloseModalButton } from '../../../components/CloseModalButton'

export function ChangeEmailModal () {
  const { user } = useUser()
  const { validateEmail, errorMessage } = useValidation()
  const { setVisibleModal, dictionary } = useSettings()

  const newEmailRef = useRef<HTMLInputElement>(null)

  const handleChangeEmail = async () => {
    const newEmail: string | undefined = newEmailRef.current?.value
    const isNewEmailValid: boolean = await validateEmail({ email: newEmail })

    if (newEmail === undefined || !user || !isNewEmailValid) return

    const emailChange = await user.changeEmail({ newEmail })

    if (emailChange.success) {
      setVisibleModal({ name: null })
    } else {
      setVisibleModal({ name: 'connection' })
    }
  }

  return (
    <Modal>
      <article className='items-center p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(200px,auto,600px)]'>
        <CloseModalButton />

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.change} {dictionary.email}
        </h2>

        <FormInput
          type='email'
          reference={newEmailRef}
          min={1}
          max={31}
          placeholder={dictionary.emailPlaceholder}
          className='placeholder:text-verdigris p-[5px]'
        />

        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

        <Button text={dictionary.change} onClick={handleChangeEmail} />
      </article>
    </Modal>
  )
}
