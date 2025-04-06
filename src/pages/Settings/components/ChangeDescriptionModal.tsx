import { useRef, useState } from 'react'
import { Button } from '../../../components/Button'
import { FormInput } from '../../../components/FormInput'
import { Modal } from '../../../components/Modal'
import { useSettings } from '../../../hooks/useSettings'
import { useUser } from '../../../hooks/useUser'
import { useValidation } from '../../../hooks/useValidation'
import { CloseModalButton } from '../../../components/CloseModalButton'
import { useQueryClient } from '@tanstack/react-query'
import { UserData } from '../../Account/models/UserData'
import { User } from '../../../models/User'

export function ChangeDescriptionModal () {
  const queryClient = useQueryClient()
  const { user, setUser } = useUser()
  const { validateDescription, errorMessage } = useValidation()
  const { openModal, closeModal, dictionary } = useSettings()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const newDescriptionRef = useRef<HTMLInputElement>(null)

  const handleChangeDescription = async () => {
    if (isLoading) return

    setIsLoading(true)

    const newDescription: string | undefined = newDescriptionRef.current?.value

    if (
      newDescription &&
      newDescription.trim() !== user?.description?.trim() &&
      newDescription.trim() !== ''
    ) {
      closeModal()
      return
    }

    const isNewDescriptionValid: boolean = validateDescription({
      description: newDescription
    })

    if (newDescription === undefined || !user || !isNewDescriptionValid) {
      setIsLoading(false)
      return
    }

    const descriptionChangeSuccess = await user.changeDescription({
      newDescription
    })

    if (descriptionChangeSuccess) {
      queryClient.setQueryData(
        ['userData', user.id],
        (prevUserData: UserData | null) => {
          if (!prevUserData) return prevUserData

          return prevUserData.update({ description: newDescription })
        }
      )

      const newUser = new User({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        imageId: user.imageId,
        imageUrl: user.imageUrl,
        description: newDescription,
        createdAt: user.createdAt
      })

      setUser(newUser)
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
          placeholder={dictionary.descriptionPlaceholder}
          className='placeholder:text-verdigris p-[5px]'
        />

        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

        <Button
          disabled={isLoading}
          text={dictionary.change}
          onClick={handleChangeDescription}
        />
      </article>
    </Modal>
  )
}
