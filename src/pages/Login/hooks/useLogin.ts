import { useState, FormEvent, ChangeEvent } from 'react'
import { useSession } from '../../../hooks/useSession'
import { useSettings } from '../../../hooks/useSettings'
import { useValidation } from '../../../hooks/useValidation'
import { UserService } from '../../../services/UserService'
import { LoginData } from '../models/LoginData'

export function useLogin () {
  const { dictionary } = useSettings()
  const { error, isValid, setError } = useValidation()
  const [isLoading, setLoading] = useState<boolean>(false)
  const { handleSessionSuccess } = useSession()
  const [loginData, setLoginData] = useState<LoginData>(
    new LoginData({ name: '', password: '' })
  )

  const handleValidation = async (event: FormEvent) => {
    event.preventDefault()

    if (isLoading) return

    setLoading(true)

    const isDataValid = await isValid({
      name: loginData.name,
      password: loginData.password
    })

    if (!isDataValid) {
      setLoading(false)
    } else {
      handleLogin()
    }
  }

  const handleLogin = async () => {
    const loginSuccess = await UserService.login({
      name: loginData.name,
      password: loginData.password
    })

    if (loginSuccess) {
      handleSessionSuccess()
    } else {
      setError(dictionary.nameOrPasswordWrong)
    }

    setLoading(false)
  }

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const newLoginData = loginData.update(event)

    setError(null)
    setLoginData(newLoginData)
  }

  return {
    error,
    loginData,
    handleInput,
    isLoading,
    handleLogin: handleValidation
  }
}
