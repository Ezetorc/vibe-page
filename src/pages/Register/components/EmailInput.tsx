import { ChangeEvent } from 'react'
import { FormInput } from '../../../components/FormInput'
import { RegisterData } from '../models/RegisterData'
import { useSettings } from '../../../hooks/useSettings'

export function EmailInput (props: {
  data: RegisterData
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  const { dictionary } = useSettings()

  return (
    <FormInput
      name='email'
      type='email'
      value={props.data.email}
      onChange={props.onChange}
      placeholder={dictionary.email}
    />
  )
}
