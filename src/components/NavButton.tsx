import { Link, useLocation } from 'wouter'
import { useSettings } from '../hooks/useSettings'
import { useSession } from '../hooks/useSession'

export function NavButton (props: {
  icon: JSX.Element
  to: string
  needsSession?: boolean
  title: string
}) {
  const [location] = useLocation()
  const { openModal } = useSettings()
  const { isSessionActive } = useSession()

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    if (!(props.needsSession ?? false)) return

    if (!isSessionActive) {
      event.preventDefault()
      openModal('session')
    }
  }

  return (
    <Link
      className='grid place-items-center aspect-square w-[60px] relative'
      onClick={handleClick}
      title={props.title}
      to={props.to}
    >
      {<props.icon.type filled={location === props.to} />}
    </Link>
  )
}
