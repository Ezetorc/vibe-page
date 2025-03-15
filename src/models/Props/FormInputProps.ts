import { ChangeEvent } from "react"

export interface FormInputProps {
  placeholder: string
  type?: React.HTMLInputTypeAttribute | undefined
  reference?: React.LegacyRef<HTMLInputElement> | undefined
  min?: number
  max?: number
  name?: string
  value?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  className?: string
}
