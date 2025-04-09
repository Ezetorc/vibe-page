import { useSettings } from '../../../hooks/useSettings'
import { useLoggedUser } from '../../../hooks/useLoggedUser'
import { Link } from 'wouter'
import { PATHS } from '../../../constants/PATHS'

export function FirstPosterMessage () {
  const { dictionary, openModal } = useSettings()
  const { isSessionActive } = useLoggedUser()

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    if (!isSessionActive()) {
      event.preventDefault()
      openModal('session')
    }
  }

  return (
    <span className='text-verdigris '>
      {dictionary.beTheFirstPoster}
      <Link
        onClick={handleClick}
        className='text-verdigris font-poppins-semibold underline'
        to={PATHS.createSection}
      >
        {dictionary.post}
      </Link>
      {'!'}
    </span>
  )
}
