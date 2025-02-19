import { FormEventHandler, ReactNode } from 'react'

export interface SelectProps {
  onInput: FormEventHandler<HTMLSelectElement>
  children: ReactNode
  defaultValue?: string
}
