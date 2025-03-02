import { Link, useLocation } from 'react-router'
import { useUser } from '../hooks/useUser'
import { useSettings } from '../hooks/useSettings'
import { NavButtonProps } from '../models/Props/NavButtonProps'

export function NavButton (props: NavButtonProps) {
  const location = useLocation()
  const { isSessionActive } = useUser()
  const { openModal } = useSettings()

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    if (!(props.needsSession ?? false)) return

    if (!isSessionActive()) {
      event.preventDefault()
      openModal("session")
    }
  }

  return (
    <Link
      className='grid place-items-center aspect-square w-[60px] relative'
      onClick={handleClick}
      title={`${props.to} Button`}
      to={props.to}
    >
      {<props.icon.type filled={location.pathname === props.to} />}
    </Link>
  )
}
