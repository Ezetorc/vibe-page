import { FormEvent } from "react"

export interface SearchBarProps {
  onInput: (event: FormEvent<HTMLInputElement>) => void
  placeholder: string
}
