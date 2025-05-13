import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { QUERY_KEYS } from '../../../constants/QUERY_KEYS'
import { useSession } from '../../../hooks/useSession'
import { useSettings } from '../../../hooks/useSettings'
import { useValidation } from '../../../hooks/useValidation'
import { User } from '../../../models/User'

export function useNameChanger (newName: string) {
  const queryClient = useQueryClient()
  const { loggedUser, setLoggedUser } = useSession()
  const { validateName, error } = useValidation()
  const { openModal, closeModal } = useSettings()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isValid = async () => {
    if (isLoading) return false

    if (newName === loggedUser?.name) {
      closeModal()
      return false
    }

    const isNewNameValid = await validateName({
      name: newName,
      unique: true
    })

    if (!newName || !loggedUser || !isNewNameValid) {
      return false
    }

    return true
  }

  const updateData = () => {
    queryClient.setQueryData(
      QUERY_KEYS.user(loggedUser!.id),
      (prevUser?: User) => {
        if (!prevUser) return prevUser

        return prevUser.update({ name: newName })
      }
    )

    const newLoggedUser = loggedUser!.update({ name: newName })

    setLoggedUser(newLoggedUser)
    closeModal()
  }

  const changeName = async () => {
    const valid = await isValid()
    if (!valid) return

    setIsLoading(true)

    const success = await loggedUser!.changeName({ newName })

    if (success) {
      updateData()
    } else {
      openModal('connection')
    }

    setIsLoading(false)
  }

  return { error, isLoading, changeName }
}
