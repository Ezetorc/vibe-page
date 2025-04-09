import { useRef, useState } from 'react'
import { Button } from '../../../components/Button'
import { FormInput } from '../../../components/FormInput'
import { Modal } from '../../../components/Modal'
import { useSettings } from '../../../hooks/useSettings'
import { useValidation } from '../../../hooks/useValidation'
import { CloseModalButton } from '../../../components/CloseModalButton'
import { useQueryClient } from '@tanstack/react-query'
import { User } from '../../../models/User'
import { useLoggedUser } from '../../../hooks/useLoggedUser'
import { QUERY_KEYS } from '../../../constants/QUERY_KEYS'

export default function ChangeNameModal () {
  const queryClient = useQueryClient()
  const { loggedUser, setLoggedUser } = useLoggedUser()
  const { validateName, errorMessage } = useValidation()
  const { openModal, closeModal, dictionary } = useSettings()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const newNameRef = useRef<HTMLInputElement>(null)

  const handleChangeName = async () => {
    if (isLoading) return

    setIsLoading(true)

    const newName: string | undefined = newNameRef.current?.value

    if (newName === loggedUser?.name) {
      closeModal()
      return
    }

    const isNewNameValid: boolean = await validateName({
      name: newName,
      unique: true
    })

    if (newName === undefined || !loggedUser || !isNewNameValid) {
      setIsLoading(false)
      return
    }

    const nameChangeSuccess = await loggedUser.changeName({ newName })

    if (nameChangeSuccess) {
      queryClient.setQueryData(
        [QUERY_KEYS.User, loggedUser.id],
        (prevUser?: User) => {
          if (!prevUser) return prevUser

          return prevUser.update({ name: newName })
        }
      )

      const newLoggedUser = loggedUser.update({ name: newName })

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
          {dictionary.changeName}
        </h2>

        <FormInput
          type='text'
          reference={newNameRef}
          min={3}
          max={20}
          placeholder={dictionary.namePlaceholder}
          className='placeholder:text-verdigris p-[5px]'
        />

        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

        <Button
          disabled={isLoading}
          text={dictionary.change}
          onClick={handleChangeName}
        />
      </article>
    </Modal>
  )
}
