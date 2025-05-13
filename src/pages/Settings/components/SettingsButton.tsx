import { Button } from '../../../components/Button'
import { useSettings } from '../../../hooks/useSettings'
import { ReactNode } from 'react'
import { useSession } from '../../../hooks/useSession'
import { ModalName } from '../../../models/ModalName'

export function SettingsButton (props: {
  children: ReactNode
  modal: ModalName
  needsSession?: boolean
  className?: string
  dangerous?: boolean
}) {
  const { openModal } = useSettings()
  const { isSessionActive } = useSession()

  const handleClick = () => {
    const modalName =
      props.needsSession && !isSessionActive ? 'session' : props.modal

    openModal(modalName)
  }

  return (
    <Button
      classname={`${
        props.dangerous && `bg-red-500 w-full desktop:hover:text-red-500`
      } ${props.className}`}
      onClick={handleClick}
    >
      {props.children}
    </Button>
  )
}
