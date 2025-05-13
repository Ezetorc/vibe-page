import { useState } from 'react'
import { useSession } from '../../../hooks/useSession'
import { useSettings } from '../../../hooks/useSettings'
import { useValidation } from '../../../hooks/useValidation'

export function usePasswordChanger (
  newPassword: string,
  confirmedNewPassword: string
) {
  const { loggedUser } = useSession()
  const { validatePasswords, error } = useValidation()
  const { openModal, closeModal } = useSettings()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isValid = () => {
    if (isLoading) return false

    const isNewPasswordValid = validatePasswords({
      password: newPassword,
      confirmedPassword: confirmedNewPassword
    })

    if (!isNewPasswordValid || !loggedUser || !newPassword) {
      return false
    }

    return true
  }

  const changePassword = async () => {
    if (!isValid()) return

    setIsLoading(true)

    const success = await loggedUser!.changePassword({ newPassword })

    if (success) {
      closeModal()
    } else {
      openModal('connection')
    }

    setIsLoading(false)
  }

  return { error, isLoading, changePassword }
}
