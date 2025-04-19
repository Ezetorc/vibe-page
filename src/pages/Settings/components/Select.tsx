import { FormEventHandler, ReactNode } from 'react'

export function Select (props: {
  onInput: FormEventHandler<HTMLSelectElement>
  children: ReactNode
  title?: string
  defaultValue?: string
}) {
  return (
    <select
      onInput={props.onInput}
      title={props.title}
      defaultValue={props.defaultValue}
      className='cursor-pointer text-center desktop:hover:bg-white desktop:hover:text-orange-crayola text-orange-crayola w-full h-[50px] border-orange-crayola border-vibe bg-transparent  rounded-vibe'
    >
      {props.children}
    </select>
  )
}
