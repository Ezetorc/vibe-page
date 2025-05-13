import { useState } from 'react'
import { useSession } from '../../../hooks/useSession'
import { useSettings } from '../../../hooks/useSettings'
import { useValidation } from '../../../hooks/useValidation'

export function useEmailChanger (newEmail: string) {
  const { loggedUser } = useSession()
  const { validateEmail, error } = useValidation()
  const { openModal, closeModal } = useSettings()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isValid = async () => {
    if (isLoading) return false

    const isNewEmailValid: boolean = await validateEmail({ email: newEmail })

    if (!newEmail || !loggedUser || !isNewEmailValid) {
      return false
    }

    return true
  }

  const changeEmail = async () => {
    const valid = await isValid()

    if (!valid) return

    setIsLoading(true)
    const success = await loggedUser!.changeEmail({ newEmail })

    if (success) {
      closeModal()
    } else {
      openModal('connection')
    }

    setIsLoading(false)
  }

  return { error, isLoading, changeEmail }
}
