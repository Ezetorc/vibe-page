import { Link } from 'wouter'
import { useSession } from '../hooks/useSession'
import { ReactNode } from 'react'

export function NavButton (props: {
  children: ReactNode
  to?: string
  onClick?: () => void
  needsSession?: boolean
  title: string
}) {
  const { isSessionActive } = useSession()

  if (props.needsSession && !isSessionActive) return null

  return props.to ? (
    <Link
      className='grid place-items-center aspect-square w-[60px] relative'
      title={props.title}
      to={props.to}
    >
      {props.children}
    </Link>
  ) : (
    <button
      className='cursor-pointer grid place-items-center aspect-square w-[60px] relative'
      title={props.title}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
