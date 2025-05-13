import { WelcomeToVibe } from '../../../components/WelcomeToVibe'
import { Button } from '../../../components/Button'
import { useSettings } from '../../../hooks/useSettings'
import { Section } from '../../../components/Section'
import { ErrorMessage } from '../../../components/ErrorMessage'
import { RegisterLink } from './RegisterLink'
import { NameInput } from '../../../components/NameInput'
import { PasswordInput } from '../../../components/PasswordInput'
import { useLogin } from '../hooks/useLogin'

export default function Login () {
  const { dictionary } = useSettings()
  const { loginData, isLoading, handleInput, handleLogin, error } = useLogin()

  return (
    <Section className='h-full gap-y-[50px]'>
      <WelcomeToVibe />

      <form className='w-full flex flex-col gap-y-[30px]'>
        <NameInput data={loginData} onChange={handleInput} />
        <PasswordInput data={loginData} onChange={handleInput} />
        <ErrorMessage value={error} />
        <Button
          classname='w-full'
          loading={isLoading}
          onClick={handleLogin}
          text={dictionary.login}
        />
      </form>

      <RegisterLink />
    </Section>
  )
}
