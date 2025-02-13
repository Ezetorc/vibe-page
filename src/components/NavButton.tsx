import { Link, useLocation } from 'react-router'
import { NavButtonProps } from '../models/NavButtonProps'
import { useUser } from '../hooks/useUser'
import { useSettings } from '../hooks/useSettings'

export function NavButton ({ icon, to, needsSession = false }: NavButtonProps) {
  const location = useLocation()
  const { isSessionActive } = useUser()
  const { setVisibleModal } = useSettings()

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    if (!needsSession) return

    if (!isSessionActive()) {
      event.preventDefault()
      setVisibleModal({
        name: 'session'
      })
    }
  }

  return (
    <Link
      className='grid place-items-center aspect-square w-[60px] relative'
      onClick={handleClick}
      to={to}
    >
      {<icon.type filled={location.pathname === to} />}
    </Link>
  )
}
