import { ChangeEvent } from 'react'
import { FormInput } from './FormInput'
import { useSettings } from '../hooks/useSettings'
import { RegisterData } from '../pages/Register/models/RegisterData'
import { LoginData } from '../pages/Login/models/LoginData'

export function PasswordInput (props: {
  data: RegisterData | LoginData
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  const { dictionary } = useSettings()

  return (
    <FormInput
      min={6}
      max={30}
      name='password'
      type='password'
      value={props.data.password}
      onChange={props.onChange}
      placeholder={dictionary.password}
    />
  )
}
