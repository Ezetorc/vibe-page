import { useRef } from 'react'
import { Button } from '../../../components/Button'
import { FormInput } from '../../../components/FormInput'
import { Modal } from '../../../components/Modal'
import { useSettings } from '../../../hooks/useSettings'
import { useUser } from '../../../hooks/useUser'
import { useValidation } from '../../../hooks/useValidation'

export function ChangeEmailModal () {
  const { user } = useUser()
  const { validateEmail, errorMessage } = useValidation()
  const { setChangeEmailModalVisible, dictionary } = useSettings()

  const newEmailRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    setChangeEmailModalVisible(false)
  }

  const handleChangeEmail = async () => {
    const newEmail: string | undefined = newEmailRef.current?.value
    const isNewEmailValid: boolean = await validateEmail(newEmail)

    if (newEmail === undefined || !user || !isNewEmailValid) return

    await user.changeEmail(newEmail)
    handleClose()
  }

  return (
    <Modal>
      <article className='items-center p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(200px,auto,600px)]'>
        <button
          onClick={handleClose}
          className='absolute top-0 right-0 pr-[2%] pt-[1%] font-poppins-semibold text-[clamp(15px,4vw,20px)]'
        >
          X
        </button>

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
         {dictionary.change?.value} {dictionary.email?.value}
        </h2>

        <FormInput
          type='email'
          reference={newEmailRef}
          min={1}
          max={31}
          placeholder={dictionary.emailPlaceholder?.value}
          className='placeholder:text-verdigris p-[5px]'
        />

        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

        <Button text={dictionary.change?.value} onClick={handleChangeEmail} />
      </article>
    </Modal>
  )
}
