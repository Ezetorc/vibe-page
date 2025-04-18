import { useState, FormEvent, ChangeEvent } from 'react'
import { useValidation } from '../../../hooks/useValidation'
import { WelcomeToVibe } from '../../../components/WelcomeToVibe'
import { Button } from '../../../components/Button'
import { useSettings } from '../../../hooks/useSettings'
import { Section } from '../../../components/Section'
import { UserService } from '../../../services/UserService'
import { Nav } from '../../../components/Nav'
import { ErrorMessage } from '../../../components/ErrorMessage'
import { RegisterData } from '../models/RegisterData'
import { NameInput } from '../../../components/NameInput'
import { EmailInput } from './EmailInput'
import { TermsInput } from './TermsInput'
import { LoginLink } from './LoginLink'
import { PasswordInput } from '../../../components/PasswordInput'
import { ConfirmPasswordInput } from './ConfirmPassword'
import { useSession } from '../../../hooks/useSession'

export default function Register () {
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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newRegisterData = registerData.update(event)

    setError(null)
    setRegisterData(newRegisterData)
  }

  return (
    <Section className='h-full gap-y-[50px]'>
      <WelcomeToVibe />

      <form className='w-full flex flex-col gap-y-[30px]'>
        <NameInput data={registerData} onChange={handleInputChange} />
        <EmailInput data={registerData} onChange={handleInputChange} />
        <PasswordInput data={registerData} onChange={handleInputChange} />
        <ConfirmPasswordInput
          data={registerData}
          onChange={handleInputChange}
        />
        <TermsInput data={registerData} onChange={handleInputChange} />
        <ErrorMessage value={error} />
        <Button onClick={handleValidation} text={dictionary.register} />
      </form>

      <LoginLink />

      <Nav />
    </Section>
  )
}
