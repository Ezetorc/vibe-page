import { WelcomeToVibe } from '../../../components/WelcomeToVibe'
import { Button } from '../../../components/Button'
import { Section } from '../../../components/Section'
import { ErrorMessage } from '../../../components/ErrorMessage'
import { NameInput } from '../../../components/NameInput'
import { EmailInput } from './EmailInput'
import { TermsInput } from './TermsInput'
import { LoginLink } from './LoginLink'
import { PasswordInput } from '../../../components/PasswordInput'
import { ConfirmPasswordInput } from './ConfirmPassword'
import { useRegister } from '../hooks/useRegister'
import { useSettings } from '../../../hooks/useSettings'

export default function Register () {
  const { dictionary } = useSettings()
  const { error, registerData, handleInput, isLoading, handleRegister } =
    useRegister()

  return (
    <Section className='h-full gap-y-[50px]'>
      <WelcomeToVibe />

      <form className='w-full flex flex-col gap-y-[30px]'>
        <NameInput data={registerData} onChange={handleInput} />
        <EmailInput data={registerData} onChange={handleInput} />
        <PasswordInput data={registerData} onChange={handleInput} />
        <ConfirmPasswordInput data={registerData} onChange={handleInput} />
        <TermsInput data={registerData} onChange={handleInput} />
        <ErrorMessage value={error} />
        <Button
          classname='w-full'
          loading={isLoading}
          onClick={handleRegister}
          text={dictionary.register}
        />
      </form>

      <LoginLink />
    </Section>
  )
}
