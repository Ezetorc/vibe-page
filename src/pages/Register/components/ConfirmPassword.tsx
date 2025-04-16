import { ChangeEvent } from 'react'
import { FormInput } from '../../../components/FormInput'
import { useSettings } from '../../../hooks/useSettings'
import { RegisterData } from '../models/RegisterData'

export function ConfirmPasswordInput (props: {
  data: RegisterData
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  const { dictionary } = useSettings()

  return (
    <FormInput
      min={6}
      max={30}
      name='confirmedPassword'
      type='password'
      value={props.data.confirmedPassword}
      onChange={props.onChange}
      placeholder={dictionary.confirmPassword}
    />
  )
}
