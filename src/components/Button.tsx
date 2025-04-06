import { ReactNode } from 'react'

export function Button (props: {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  children?: ReactNode
  text?: string
  type?: 'filled' | 'outline'
  classname?: string
  disabled?: boolean
}) {
  const type: 'filled' | 'outline' = props.type ?? 'filled'
  
  const className =
    type === 'filled'
      ? `${props.classname} cursor-pointer hover:bg-white hover:text-orange-crayola w-full h-[50px] bg-orange-crayola rounded-vibe`
      : `${props.classname} cursor-pointer text-orange-crayola hover:bg-white hover:border-white w-full h-[50px] bg-transparent border-orange-crayola border-vibe  rounded-vibe`

  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={className}
    >
      {props.text}
      {props.children}
    </button>
  )
}
