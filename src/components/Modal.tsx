import { ReactNode } from 'react'

export function Modal (props: { children: ReactNode }) {
  return (
    <div className='fixed grid place-items-center w-screen h-screen backdrop-blur-sm z-50'>
      {props.children}
    </div>
  )
}
