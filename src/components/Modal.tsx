import { ModalProps } from '../models/ModalProps'

export function Modal ({ children }: ModalProps) {
  return (
    <div className='fixed grid place-items-center w-screen h-screen backdrop-blur-sm z-50'>{children}</div>
  )
}
