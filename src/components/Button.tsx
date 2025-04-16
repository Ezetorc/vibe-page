import { ReactNode } from 'react'
import { useSettings } from '../hooks/useSettings'

export function Button (props: {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  children?: ReactNode
  text?: string
  type?: 'filled' | 'outline'
  classname?: string
  loading?: boolean
}) {
  const { dictionary } = useSettings()
  const type: 'filled' | 'outline' = props.type ?? 'filled'

  
  const className =
    type === 'filled'
      ? `${props.classname} cursor-pointer hover:bg-white hover:text-orange-crayola w-full h-[50px] bg-orange-crayola rounded-vibe`
      : `${props.classname} cursor-pointer text-orange-crayola hover:bg-white hover:border-white w-full h-[50px] bg-transparent border-orange-crayola border-vibe  rounded-vibe`

  return (
    <button
      onClick={props.onClick}
      disabled={props.loading}
      className={className}
    >
      {props.loading ? `${dictionary.loading}...` : props.text}
      {props.children}
    </button>
  )
}
