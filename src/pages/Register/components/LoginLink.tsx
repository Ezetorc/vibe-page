import { Link } from 'wouter'
import { PATHS } from '../../../constants/PATHS'
import { useSettings } from '../../../hooks/useSettings'

export function LoginLink () {
  const { dictionary } = useSettings()

  return (
    <Link to={PATHS.loginSection} className='text-verdigris underline'>
      {dictionary.iHaveAnAccount}
    </Link>
  )
}
