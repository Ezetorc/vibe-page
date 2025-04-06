import { Link, useNavigate } from 'react-router'
import { useState, useCallback, ChangeEvent } from 'react'
import { useValidation } from '../../../hooks/useValidation'
import { FormInput } from '../../../components/FormInput'
import { WelcomeToVibe } from '../../../components/WelcomeToVibe'
import { Button } from '../../../components/Button'
import { useUser } from '../../../hooks/useUser'
import { useSettings } from '../../../hooks/useSettings'
import { Section } from '../../../components/Section'
import { UserService } from '../../../services/UserService'
import { Nav } from '../../../components/Nav'
import { PATHS } from '../../../constants/PATHS'

export default function Register () {
  const {
    errorMessage,
    setErrorMessage,
    validateName,
    validateEmail,
    validatePasswords,
    validateAgreeWithTerms
  } = useValidation()
  const { dictionary } = useSettings()
  const { handleSession } = useUser()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmedPassword: '',
    agreeWithTerms: false
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const isFormDataValid = useCallback(async () => {
    const { name, email, password, confirmedPassword, agreeWithTerms } =
      formData
    const hasAgreedWithTerms = validateAgreeWithTerms({ agreeWithTerms })

    if (!hasAgreedWithTerms) {
      setIsLoading(false)
      return
    }

    const isPasswordValid = validatePasswords({ password, confirmedPassword })
    if (!isPasswordValid) {
      setIsLoading(false)
      return
    }

    const isNameValid = await validateName({ name, unique: true })
    if (!isNameValid) {
      setIsLoading(false)
      return
    }

    const isEmailValid = await validateEmail({ email, unique: true })
    if (!isEmailValid) {
      setIsLoading(false)
      return
    }

    return true
  }, [
    formData,
    validateAgreeWithTerms,
    validateEmail,
    validateName,
    validatePasswords
  ])

  const handleRegister = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)

    const formDataValid = await isFormDataValid()

    if (!formDataValid) return

    const registerSuccess = await UserService.register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    })

    if (registerSuccess) {
      const sessionSuccess = await handleSession()

      if (sessionSuccess) {
        navigate(PATHS.accountSection)
      } else {
        navigate(PATHS.homeSection)
      }
    } else {
      setErrorMessage(dictionary.userAlreadyExists)
    }

    setIsLoading(false)
  }, [
    dictionary.userAlreadyExists,
    formData,
    handleSession,
    isFormDataValid,
    isLoading,
    navigate,
    setErrorMessage
  ])

  return (
    <Section className='h-full gap-y-[50px]'>
      <WelcomeToVibe />

      <form className='w-full flex flex-col gap-y-[30px]'>
        <FormInput
          min={3}
          max={20}
          name='name'
          value={formData.name}
          onChange={handleChange}
          placeholder={dictionary.name}
        />
        <FormInput
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
          placeholder={dictionary.email}
        />
        <FormInput
          min={6}
          max={30}
          name='password'
          type='password'
          value={formData.password}
          onChange={handleChange}
          placeholder={dictionary.password}
        />
        <FormInput
          min={6}
          max={30}
          name='confirmedPassword'
          type='password'
          value={formData.confirmedPassword}
          onChange={handleChange}
          placeholder={dictionary.confirmPassword}
        />

        <div className='flex gap-x-5 items-center'>
          <input
            name='agreeWithTerms'
            type='checkbox'
            id='agree-with-terms'
            checked={formData.agreeWithTerms}
            onChange={handleChange}
            className='peer hidden'
          />
          <label
            htmlFor='agree-with-terms'
            className='relative w-6 h-6 flex items-center justify-center border-2 border-white rounded-full cursor-pointer peer-checked:bg-orange-crayola peer-checked:border-orange-crayola'
          >
            <span className='absolute w-3 h-3 bg-white rounded-full opacity-0 scale-0 peer-checked:opacity-100 peer-checked:scale-100'></span>
          </label>
          <label className='font-poppins-light' htmlFor='agree-with-terms'>
            {dictionary.iAgreeWith}{' '}
            <Link
              to='/terms'
              className='border-b-2 border-b-white hover:border-b-orange-crayola hover:text-orange-crayola'
            >
              {dictionary.termsAndConditions}
            </Link>
          </label>
        </div>

        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

        <Button
          onClick={e => {
            e.preventDefault()
            handleRegister()
          }}
          text={dictionary.register}
        />
      </form>

      <Link to='/login' className='text-verdigris underline'>
        {dictionary.iHaveAnAccount}
      </Link>

      <Nav />
    </Section>
  )
}
