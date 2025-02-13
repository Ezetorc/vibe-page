import { Language } from './Language'

export interface Settings {
  api: string
  languages: { [key in Language]: string }
  apiAbortSeconds: number
  defaultLanguage: Language
}
