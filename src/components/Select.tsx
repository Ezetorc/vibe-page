import { SelectProps } from '../models/Props/SelectProps'

export function Select (props: SelectProps) {
  return (
    <select
      onInput={props.onInput}
      defaultValue={props.defaultValue}
      className='cursor-pointer text-center hover:bg-white hover:text-orange-crayola text-orange-crayola w-full h-[50px] border-orange-crayola border-vibe bg-transparent font-poppins-regular rounded-vibe'
    >
      {props.children}
    </select>
  )
}
