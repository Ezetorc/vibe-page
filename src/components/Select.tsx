import { SelectProps } from '../models/SelectProps'

export function Select ({ onInput, children, defaultValue }: SelectProps) {
  return (
    <select
      onInput={onInput}
      defaultValue={defaultValue}
      className='cursor-pointer text-center hover:bg-white hover:text-orange-crayola w-full h-[50px] bg-orange-crayola font-poppins-regular rounded-vibe'
    >
      {children}
    </select>
  )
}
