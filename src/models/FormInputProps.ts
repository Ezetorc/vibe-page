export interface FormInputProps {
  placeholder: string
  type?: React.HTMLInputTypeAttribute | undefined
  reference?: React.LegacyRef<HTMLInputElement> | undefined
  min?: number
  max?: number
}
