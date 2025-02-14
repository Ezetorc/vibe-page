import { API } from 'api-responser'
import { Language } from './Language'

export interface Settings {
  api: API
  languages: { [key in Language]: string }
  defaultLanguage: Language
}
