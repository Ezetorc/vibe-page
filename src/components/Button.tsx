import { ReactNode } from 'react'
import { useSettings } from '../hooks/useSettings'

export function Button (props: {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  children?: ReactNode
  text?: string
  filled?: boolean
  classname?: string
  loading?: boolean
}) {
  const { dictionary } = useSettings()
  const filled = props.filled ?? true
  const loading = props.loading ?? false

  const classes =
    filled && !loading
      ? `${props.classname} desktop:hover:bg-white desktop:hover:text-orange-crayola bg-orange-crayola`
      : `${props.classname} text-orange-crayola desktop:hover:bg-white desktop:hover:border-white bg-transparent border-orange-crayola border-vibe`

  return (
    <button
      onClick={props.onClick}
      disabled={loading}
      className={`${classes} cursor-pointer h-[50px] rounded-vibe`}
    >
      {props.loading ? `${dictionary.loading}...` : props.text}
      {props.children}
    </button>
  )
}
