import { Link } from 'react-router'
import { useSettings } from '../../../hooks/useSettings'
import { useUser } from '../../../hooks/useUser'

export function FirstPosterMessage () {
  const { dictionary, openModal } = useSettings()
  const { isSessionActive } = useUser()

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
        to='/create'
      >
        {dictionary.post}
      </Link>
      {'!'}
    </span>
  )
}
