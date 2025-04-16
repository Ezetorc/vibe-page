import { Link } from 'wouter'
import { PATHS } from '../../../constants/PATHS'
import { useSettings } from '../../../hooks/useSettings'

export function RegisterLink () {
  const { dictionary } = useSettings()

  return (
    <Link to={PATHS.registerSection} className='text-verdigris underline'>
      {dictionary.iDontHaveAnAccount}
    </Link>
  )
}
