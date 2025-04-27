import { useRef, useState } from 'react'
import { Button } from '../../../components/Button'
import { FormInput } from '../../../components/FormInput'
import { Modal } from '../../../components/Modal'
import { useSettings } from '../../../hooks/useSettings'
import { useValidation } from '../../../hooks/useValidation'
import { CloseModalButton } from '../../../components/CloseModalButton'
import { useSession } from '../../../hooks/useSession'
import { ErrorMessage } from '../../../components/ErrorMessage'

export default function ChangeEmailModal () {
  const { loggedUser } = useSession()
  const { validateEmail, error } = useValidation()
  const { openModal, closeModal, dictionary } = useSettings()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const newEmailRef = useRef<HTMLInputElement>(null)

  const handleChangeEmail = async () => {
    if (isLoading) return

    setIsLoading(true)

    const newEmail: string | undefined = newEmailRef.current?.value
    const isNewEmailValid: boolean = await validateEmail({ email: newEmail })

    if (newEmail === undefined || !loggedUser || !isNewEmailValid) {
      setIsLoading(false)
      return
    }

    const emailChangeSuccess = await loggedUser.changeEmail({ newEmail })

    if (emailChangeSuccess) {
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
          {dictionary.changeEmail}
        </h2>

        <FormInput
          type='email'
          reference={newEmailRef}
          min={1}
          max={31}
          placeholder={dictionary.myNewEmail}
          className='placeholder:text-verdigris p-[5px]'
        />

        <ErrorMessage value={error} />

        <Button
          loading={isLoading}
          text={dictionary.change}
          onClick={handleChangeEmail}
        />
      </article>
    </Modal>
  )
}
