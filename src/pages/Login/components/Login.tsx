import { FormInput } from '../../../components/FormInput'
import { useRef } from 'react'
import { useValidation } from '../../../hooks/useValidation'
import { WelcomeToVibe } from '../../../components/WelcomeToVibe'
import { Link, useNavigate } from 'react-router'
import { Button } from '../../../components/Button'
import { useUser } from '../../../hooks/useUser'
import { useSettings } from '../../../hooks/useSettings'
import { Section } from '../../../components/Section'
import { UserService } from '../../../services/UserService'

export default function Login () {
  const { dictionary, setVisibleModal } = useSettings()
  const { errorMessage, validateName, validatePassword, setErrorMessage } =
    useValidation()
  const { handleSession } = useUser()
  const navigate = useNavigate()
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const passwordInputRef = useRef<HTMLInputElement | null>(null)

  const handleLogin = async (): Promise<void> => {
    const name = nameInputRef.current?.value
    const password = passwordInputRef.current?.value
    const isNameValid = await validateName({ name })
    const isPasswordValid = validatePassword({ password })

    if (isNameValid && isPasswordValid) {
      const logSuccesfull = await UserService.login({ name: name!, password: password! })

      if (logSuccesfull.value) {
        const sessionSuccess = await handleSession()

        if (sessionSuccess) {
          navigate('/')
        } else {
          setVisibleModal({ name: 'connection' })
        }
      } else {
        setErrorMessage(dictionary.nameOrPasswordWrong)
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
          placeholder={dictionary.name}
        />
        <FormInput
          min={6}
          max={30}
          reference={passwordInputRef}
          type='password'
          placeholder={dictionary.password}
        />

        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

        <Button
          onClick={event => {
            event.preventDefault()
            handleLogin()
          }}
          text={dictionary.login}
        />
      </form>

      <Link to='/register' className='text-verdigris underline'>
        {dictionary.iDontHaveAnAccount}
      </Link>
    </Section>
  )
}
