import { FormInput } from '../../../components/FormInput'
import { User } from '../../../models/User'
import { useRef } from 'react'
import { useValidation } from '../../../hooks/useValidation'
import { WelcomeToVibe } from '../../../components/WelcomeToVibe'

export default function Login () {
  const { errorMessage, validateName, validatePassword } = useValidation()
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const passwordInputRef = useRef<HTMLInputElement | null>(null)

  const handleLogin = () => {
    const name = nameInputRef.current?.value
    const password = passwordInputRef.current?.value

    const isFormValid: boolean =
      validateName(name) && validatePassword(password)

    if (isFormValid && name && password) {
      User.login(name, password)
    }
  }

  return (
    <section className='justify-items-center grid grid-rows-[1fr,4fr] w-[clamp(320px,100%,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] min-h-screen'>
      <WelcomeToVibe />

      <form className='w-full flex flex-col gap-y-[20px]'>
        <FormInput
          min={1}
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

        <input
          className='cursor-pointer hover:bg-white hover:text-orange-crayola w-full h-[50px] bg-orange-crayola font-poppins-regular rounded-vibe'
          type='submit'
          value='Login'
          onClick={event => {
            event.preventDefault()
            handleLogin()
          }}
        />
      </form>
    </section>
  )
}
