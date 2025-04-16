import { useState, ChangeEvent, FormEvent } from 'react'
import { useValidation } from '../../../hooks/useValidation'
import { WelcomeToVibe } from '../../../components/WelcomeToVibe'
import { Button } from '../../../components/Button'
import { useSettings } from '../../../hooks/useSettings'
import { Section } from '../../../components/Section'
import { UserService } from '../../../services/UserService'
import { Nav } from '../../../components/Nav'
import { useSession } from '../../../hooks/useSession'
import { ErrorMessage } from '../../../components/ErrorMessage'
import { LoginData } from '../models/LoginData'
import { RegisterLink } from './RegisterLink'
import { NameInput } from '../../../components/NameInput'
import { PasswordInput } from '../../../components/PasswordInput'

export default function Login () {
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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newLoginData = loginData.update(event)

    setError(null)
    setLoginData(newLoginData)
  }

  return (
    <Section className='h-full gap-y-[50px]'>
      <WelcomeToVibe />

      <form className='w-full flex flex-col gap-y-[30px]'>
        <NameInput data={loginData} onChange={handleInputChange} />
        <PasswordInput data={loginData} onChange={handleInputChange} />
        <ErrorMessage value={error} />
        <Button loading={isLoading} onClick={handleValidation} text={dictionary.login} />
      </form>

      <RegisterLink />

      <Nav />
    </Section>
  )
}
