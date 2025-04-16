import { useSettings } from '../../../hooks/useSettings'
import { Link } from 'wouter'
import { PATHS } from '../../../constants/PATHS'
import { useSession } from '../../../hooks/useSession'

export function FirstPosterMessage () {
  const { dictionary, openModal } = useSettings()
  const { isSessionActive } = useSession()

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    if (!isSessionActive) {
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
