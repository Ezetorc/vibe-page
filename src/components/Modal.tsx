import { ModalProps } from '../models/Props/ModalProps'

export function Modal (props: ModalProps) {
  return (
    <div className='fixed grid place-items-center w-screen h-screen backdrop-blur-sm z-50'>
      {props.children}
    </div>
  )
}
