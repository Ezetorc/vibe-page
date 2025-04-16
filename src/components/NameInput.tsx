import { ChangeEvent } from 'react'
import { FormInput } from './FormInput'
import { RegisterData } from '../pages/Register/models/RegisterData'
import { useSettings } from '../hooks/useSettings'
import { LoginData } from '../pages/Login/models/LoginData'

export function NameInput (props: {
  data: RegisterData | LoginData
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  const { dictionary } = useSettings()

  return (
    <FormInput
      min={3}
      max={20}
      name='name'
      value={props.data.name}
      onChange={props.onChange}
      placeholder={dictionary.name}
    />
  )
}
