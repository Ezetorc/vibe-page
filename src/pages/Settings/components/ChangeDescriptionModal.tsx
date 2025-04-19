import { useRef, useState } from 'react'
import { Button } from '../../../components/Button'
import { FormInput } from '../../../components/FormInput'
import { Modal } from '../../../components/Modal'
import { useSettings } from '../../../hooks/useSettings'
import { useValidation } from '../../../hooks/useValidation'
import { CloseModalButton } from '../../../components/CloseModalButton'
import { useQueryClient } from '@tanstack/react-query'
import { User } from '../../../models/User'
import { useSession } from '../../../hooks/useSession'
import { QUERY_KEYS } from '../../../constants/QUERY_KEYS'
import { ErrorMessage } from '../../../components/ErrorMessage'

export default function ChangeDescriptionModal () {
  const queryClient = useQueryClient()
  const { loggedUser, setLoggedUser } = useSession()
  const { validateDescription, error } = useValidation()
  const { openModal, closeModal, dictionary } = useSettings()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const newDescriptionRef = useRef<HTMLInputElement>(null)

  const handleChangeDescription = async () => {
    if (isLoading) return

    setIsLoading(true)

    const newDescription: string | undefined = newDescriptionRef.current?.value

    if (
      newDescription &&
      newDescription.trim() !== loggedUser?.description?.trim() &&
      newDescription.trim() !== ''
    ) {
      closeModal()
      return
    }

    const isNewDescriptionValid: boolean = validateDescription({
      description: newDescription
    })

    if (newDescription === undefined || !loggedUser || !isNewDescriptionValid) {
      setIsLoading(false)
      return
    }

    const descriptionChangeSuccess = await loggedUser.changeDescription({
      newDescription
    })

    if (descriptionChangeSuccess) {
      queryClient.setQueryData(
        [QUERY_KEYS.User, loggedUser.id],
        (prevUser?: User) => {
          if (!prevUser) return prevUser

          return prevUser.update({ description: newDescription })
        }
      )

      const newLoggedUser = loggedUser.update({ description: newDescription })

      setLoggedUser(newLoggedUser)
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
          {dictionary.changeDescription}
        </h2>

        <FormInput
          type='text'
          reference={newDescriptionRef}
          min={0}
          max={200}
          placeholder={loggedUser?.description ?? ''}
          className='placeholder:text-verdigris p-[5px]'
        />

        <ErrorMessage value={error} />

        <Button
          loading={isLoading}
          text={dictionary.change}
          onClick={handleChangeDescription}
        />
      </article>
    </Modal>
  )
}
