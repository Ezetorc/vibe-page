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

export function ChangeNameModal () {
  const queryClient = useQueryClient()
  const { user, setUser } = useUser()
  const { validateName, errorMessage } = useValidation()
  const { openModal, closeModal, dictionary } = useSettings()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const newNameRef = useRef<HTMLInputElement>(null)

  const handleChangeName = async () => {
    if (isLoading) return

    setIsLoading(true)

    const newName: string | undefined = newNameRef.current?.value

    if (newName === user?.name) {
      closeModal()
      return
    }

    const isNewNameValid: boolean = await validateName({
      name: newName,
      unique: true
    })

    if (newName === undefined || !user || !isNewNameValid) {
      setIsLoading(false)
      return
    }

    const nameChangeSuccess = await user.changeName({ newName })

    if (nameChangeSuccess) {
      queryClient.setQueryData(
        ['userData', user.id],
        (prevUserData: UserData | null) => {
          if (!prevUserData) return prevUserData

          return prevUserData.update({ name: newName })
        }
      )

      const newUser = new User({
        id: user.id,
        name: newName,
        email: user.email,
        password: user.password,
        imageId: user.imageId,
        imageUrl: user.imageUrl,
        description: user.description,
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
