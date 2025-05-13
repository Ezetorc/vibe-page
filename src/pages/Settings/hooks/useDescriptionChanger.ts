import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { QUERY_KEYS } from '../../../constants/QUERY_KEYS'
import { useSession } from '../../../hooks/useSession'
import { useSettings } from '../../../hooks/useSettings'
import { useValidation } from '../../../hooks/useValidation'
import { User } from '../../../models/User'

export function useDescriptionChanger (newDescription: string) {
  const queryClient = useQueryClient()
  const { loggedUser, setLoggedUser } = useSession()
  const { validateDescription, error } = useValidation()
  const { openModal, closeModal } = useSettings()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isValid = () => {
    if (isLoading) return false

    const isNewDescriptionValid: boolean = validateDescription({
      description: newDescription
    })

    if (!loggedUser || !isNewDescriptionValid) {
      return false
    }

    return true
  }

  const updateData = () => {
    queryClient.setQueryData(
      QUERY_KEYS.user(loggedUser!.id),
      (prevUser?: User) => {
        if (!prevUser) return prevUser

        return prevUser.update({ description: newDescription })
      }
    )

    const newLoggedUser = loggedUser!.update({ description: newDescription })

    setLoggedUser(newLoggedUser)
  }

  const changeDescription = async () => {
    if (!isValid()) return

    setIsLoading(true)

    const success = await loggedUser!.changeDescription({ newDescription })

    if (success) {
      updateData()
      closeModal()
    } else {
      openModal('connection')
    }

    setIsLoading(false)
  }

  return { error, isLoading, changeDescription }
}
