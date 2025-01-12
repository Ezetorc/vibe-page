import { Link, useLocation } from 'react-router'
import { NavButtonProps } from '../../../models/NavButtonProps'
import { useUser } from '../../../hooks/useUser'
import { useSettings } from '../../../hooks/useSettings'

export function NavButton({ icon, to, needsSession = false }: NavButtonProps) {
  const location = useLocation()
  const { isSessionActive } = useUser()
  const { setSessionModalVisible } = useSettings()

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    if (!needsSession) return

    if (!isSessionActive()) {
      event.preventDefault()
      setSessionModalVisible(true)
    }
  }

  return (
    <Link onClick={handleClick} to={to}>
      {<icon.type filled={location.pathname === to} />}
    </Link>
  )
}
