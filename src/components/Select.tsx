import { SelectProps } from '../models/Props/SelectProps'

export function Select (props: SelectProps) {
  return (
    <select
      onInput={props.onInput}
      defaultValue={props.defaultValue}
      className='cursor-pointer text-center hover:bg-white hover:text-orange-crayola w-full h-[50px] bg-orange-crayola font-poppins-regular rounded-vibe'
    >
      {props.children}
    </select>
  )
}
