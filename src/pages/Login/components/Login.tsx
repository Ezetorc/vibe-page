import { FormInput } from '../../../components/FormInput'
import { useState, useCallback, ChangeEvent } from 'react'
import { useValidation } from '../../../hooks/useValidation'
import { WelcomeToVibe } from '../../../components/WelcomeToVibe'
import { Link, useNavigate } from 'react-router'
import { Button } from '../../../components/Button'
import { useUser } from '../../../hooks/useUser'
import { useSettings } from '../../../hooks/useSettings'
import { Section } from '../../../components/Section'
import { UserService } from '../../../services/UserService'

export default function Login () {
  const { dictionary, openModal } = useSettings()
  const { errorMessage, validateName, validatePassword, setErrorMessage } =
    useValidation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { handleSession } = useUser()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ name: '', password: '' })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const isFormDataValid = useCallback(async () => {
    const { name, password } = formData

    const isPasswordValid = validatePassword({ password })

    if (!isPasswordValid) {
      setIsLoading(false)
      return false
    }

    const isNameValid = await validateName({ name })

    if (!isNameValid) {
      setIsLoading(false)
      return false
    }

    return true
  }, [formData, validateName, validatePassword])

  const handleLogin = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)

    const formDataValid = await isFormDataValid()

    if (!formDataValid) return

    const logSuccess = await UserService.login({
      name: formData.name,
      password: formData.password
    })

    if (logSuccess) {
      const sessionSuccess = await handleSession()

      setIsLoading(false)

      if (sessionSuccess) {
        navigate('/account/me')
      } else {
        openModal('connection')
      }
    } else {
      setIsLoading(false)
      setErrorMessage(dictionary.nameOrPasswordWrong)
    }
  }, [
    dictionary.nameOrPasswordWrong,
    formData,
    handleSession,
    isFormDataValid,
    isLoading,
    navigate,
    openModal,
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
          type='text'
          value={formData.name}
          onChange={handleChange}
          placeholder={dictionary.name}
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
