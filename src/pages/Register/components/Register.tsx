import { Link, useNavigate } from 'react-router'
import { User } from '../../../models/User'
import { useRef } from 'react'
import { useValidation } from '../../../hooks/useValidation'
import { FormInput } from '../../../components/FormInput'
import { WelcomeToVibe } from '../../../components/WelcomeToVibe'
import { Button } from '../../../components/Button'
import { useUser } from '../../../hooks/useUser'

export default function Register () {
  const {
    errorMessage,
    setErrorMessage,
    validateName,
    validateEmail,
    validatePasswords,
    validateAgreeWithTerms
  } = useValidation()
  const { handleToken } = useUser()
  const navigate = useNavigate()
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const emailInputRef = useRef<HTMLInputElement | null>(null)
  const passwordInputRef = useRef<HTMLInputElement | null>(null)
  const confirmPasswordInputRef = useRef<HTMLInputElement | null>(null)
  const agreeWithTermsInputRef = useRef<HTMLInputElement | null>(null)

  const handleRegister = async (): Promise<void> => {
    const name = nameInputRef.current?.value
    const email = emailInputRef.current?.value
    const password = passwordInputRef.current?.value
    const confirmedPassword = confirmPasswordInputRef.current?.value
    const agreeWithTerms = agreeWithTermsInputRef.current?.checked

    const isFormValid: boolean =
      validateName(name) &&
      validateEmail(email) &&
      validatePasswords(password, confirmedPassword) &&
      validateAgreeWithTerms(agreeWithTerms)

    if (isFormValid && name && email && password) {
      const registerSuccessful = await User.register(name, email, password)

      if (registerSuccessful) {
        handleToken()
        navigate('/')
      } else {
        setErrorMessage('User already exists!')
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
        <FormInput reference={emailInputRef} type='email' placeholder='Email' />
        <FormInput
          min={6}
          max={30}
          reference={passwordInputRef}
          type='password'
          placeholder='Password'
        />
        <FormInput
          min={6}
          max={30}
          reference={confirmPasswordInputRef}
          type='password'
          placeholder='Confirm Password'
        />

        <div className='flex gap-x-5 items-center'>
          <input
            ref={agreeWithTermsInputRef}
            type='checkbox'
            id='agree-with-terms'
            className='peer hidden'
          />
          <label
            htmlFor='agree-with-terms'
            className='relative w-6 h-6 flex items-center justify-center border-2 border-white rounded-full cursor-pointer peer-checked:bg-orange-crayola peer-checked:border-orange-crayola'
          >
            <span className='absolute w-3 h-3 bg-white rounded-full opacity-0 scale-0 peer-checked:opacity-100 peer-checked:scale-100'></span>
          </label>
          <label className='font-poppins-light' htmlFor='agree-with-terms'>
            I agree with{` `}
            <Link
              to='/terms'
              className='border-b-2 border-b-white hover:border-b-orange-crayola hover:text-orange-crayola'
            >
              Terms & Conditions
            </Link>
          </label>
        </div>
        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

        <Button
          onClick={event => {
            event.preventDefault()
            handleRegister()
          }}
          text='Register'
        />
      </form>
    </section>
  )
}
