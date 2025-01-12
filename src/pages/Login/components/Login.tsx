import { FormInput } from '../../../components/FormInput'
import { User } from '../../../models/User'
import { useRef } from 'react'
import { useValidation } from '../../../hooks/useValidation'
import { WelcomeToVibe } from '../../../components/WelcomeToVibe'
import { useNavigate } from 'react-router'
import { Button } from '../../../components/Button'
import { useUser } from '../../../hooks/useUser'

export default function Login () {
  const { errorMessage, validateName, validatePassword, setErrorMessage } =
    useValidation()
  const { handleToken } = useUser()
  const navigate = useNavigate()
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const passwordInputRef = useRef<HTMLInputElement | null>(null)

  const handleLogin = async (): Promise<void> => {
    const name = nameInputRef.current?.value
    const password = passwordInputRef.current?.value

    const isFormValid: boolean =
      validateName(name) && validatePassword(password)

    if (isFormValid && name && password) {
      const logSuccesfull = await User.login(name, password)

      if (logSuccesfull) {
        handleToken()
        navigate('/')
      } else {
        setErrorMessage('The name or password is wrong!')
      }
    }
  }

  return (
    <section className='justify-items-center grid grid-rows-[1fr,4fr] w-[clamp(320px,100%,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] min-h-screen'>
      <WelcomeToVibe />

      <form className='w-full flex flex-col gap-y-[20px]'>
        <FormInput
          min={3}
          max={20}
          reference={nameInputRef}
          placeholder='Name'
        />
        <FormInput
          min={6}
          max={30}
          reference={passwordInputRef}
          type='password'
          placeholder='Password'
        />

        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

        <Button
          onClick={event => {
            event.preventDefault()
            handleLogin()
          }}
          text='Login'
        />
      </form>
    </section>
  )
}
