import { FormInput } from '../../../components/FormInput'
import { User } from '../../../models/User'
import { useRef } from 'react'
import { useValidation } from '../../../hooks/useValidation'
import { WelcomeToVibe } from '../../../components/WelcomeToVibe'
import { Link, useNavigate } from 'react-router'
import { Button } from '../../../components/Button'
import { useUser } from '../../../hooks/useUser'
import { useSettings } from '../../../hooks/useSettings'
import { Section } from '../../../components/Section'

export default function Login () {
  const { dictionary } = useSettings()
  const { errorMessage, validateName, validatePassword, setErrorMessage } =
    useValidation()
  const { handleSession } = useUser()
  const navigate = useNavigate()
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const passwordInputRef = useRef<HTMLInputElement | null>(null)

  const handleLogin = async (): Promise<void> => {
    const name = nameInputRef.current?.value
    const password = passwordInputRef.current?.value

    const isFormValid: boolean =
      validateName(name) && validatePassword(password)

    if (isFormValid && name && password) {
      const logSuccesfull: boolean = await User.login(name, password)

      if (logSuccesfull) {
        await handleSession()
        navigate('/')
      } else {
        setErrorMessage(dictionary.nameOrPasswordWrong?.value)
      }
    }
  }

  return (
    <Section className='h-full gap-y-[50px]'>
      <WelcomeToVibe />

      <form className='w-full flex flex-col gap-y-[30px]'>
        <FormInput
          min={3}
          max={20}
          reference={nameInputRef}
          placeholder={dictionary.name?.value}
        />
        <FormInput
          min={6}
          max={30}
          reference={passwordInputRef}
          type='password'
          placeholder={dictionary.password?.value}
        />

        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

        <Button
          onClick={event => {
            event.preventDefault()
            handleLogin()
          }}
          text={dictionary.login?.value}
        />
      </form>

      <Link to="/register" className='text-verdigris underline'>{dictionary.iDontHaveAnAccount?.value}</Link>

    </Section>
  )
}
