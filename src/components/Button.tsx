import { ButtonProps } from '../models/Props/ButtonProps'

export function Button (props: ButtonProps) {
  const type: 'filled' | 'outline' = props.type ?? 'filled'
  const className =
    type === 'filled'
      ? `${props.classname} cursor-pointer hover:bg-white hover:text-orange-crayola w-full h-[50px] bg-orange-crayola font-poppins-regular rounded-vibe`
      : `${props.classname} cursor-pointer text-orange-crayola hover:bg-white hover:border-white w-full h-[50px] bg-transparent border-orange-crayola border-vibe font-poppins-regular rounded-vibe`

  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={className}
    >
      {props.text}
    </button>
  )
}
