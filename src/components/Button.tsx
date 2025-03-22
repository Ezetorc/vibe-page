import { ButtonProps } from '../models/Props/ButtonProps'

export function Button (props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={`${props.classname} cursor-pointer hover:bg-white hover:text-orange-crayola w-full h-[50px] bg-orange-crayola font-poppins-regular rounded-vibe`}
    >
      {props.text}
    </button>
  )
}
