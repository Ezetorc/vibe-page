import { useState, FormEvent, ChangeEvent } from 'react'
import { useSession } from '../../../hooks/useSession'
import { useSettings } from '../../../hooks/useSettings'
import { useValidation } from '../../../hooks/useValidation'
import { UserService } from '../../../services/UserService'
import { RegisterData } from '../models/RegisterData'

export function useRegister () {
  const { error, setError, isValid } = useValidation()
  const { dictionary } = useSettings()
  const { handleSessionSuccess } = useSession()
  const [isLoading, setLoading] = useState<boolean>(false)
  const [registerData, setRegisterData] = useState<RegisterData>(
    new RegisterData({
      name: '',
      email: '',
      password: '',
      confirmedPassword: '',
      agreeWithTerms: false
    })
  )

  const handleValidation = async (event: FormEvent) => {
    event.preventDefault()

    if (isLoading) return

    setLoading(true)

    const isDataValid = await isValid({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      confirmedPassword: registerData.confirmedPassword,
      agreeWithTerms: registerData.agreeWithTerms,
      nameUnique: true,
      emailUnique: true
    })

    if (!isDataValid) {
      setLoading(false)
    } else {
      handleRegister()
    }
  }

  const handleRegister = async () => {
    const registerSuccess = await UserService.register({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password
    })

    if (registerSuccess) {
      handleSessionSuccess()
    } else {
      setError(dictionary.somethingWentWrong)
    }

    setLoading(false)
  }

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const newRegisterData = registerData.update(event)

    setError(null)
    setRegisterData(newRegisterData)
  }

  return {
    error,
    registerData,
    handleInput,
    isLoading,
    handleRegister: handleValidation
  }
}
