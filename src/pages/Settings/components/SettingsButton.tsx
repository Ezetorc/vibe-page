import { Button } from '../../../components/Button'
import { useSettings } from '../../../hooks/useSettings'
import { ReactNode, useCallback } from 'react'
import { ModalName } from '../../../models/ModalName'
import { useSession } from '../../../hooks/useSession'

export function SettingsButton (props: {
  children: ReactNode
  modal: ModalName
  needsSession?: boolean
  className?: string
  dangerous?: boolean
}) {
  const { openModal } = useSettings()
  const { isSessionActive } = useSession()

  const handleClick = useCallback(() => {
    openModal(props.needsSession && !isSessionActive ? 'session' : props.modal)
  }, [isSessionActive, openModal, props.modal, props.needsSession])

  return (
    <Button
      classname={`${props.dangerous && `bg-red-500 hover:text-red-500`} ${
        props.className
      }`}
      onClick={handleClick}
    >
      {props.children}
    </Button>
  )
}
