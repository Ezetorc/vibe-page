import { Language } from './Language'
import { Cloud } from './Cloud'
import { API } from './API'

export interface Settings {
  api: API
  languages: { [key in Language]: string }
  defaultLanguage: Language
  cloudinary: Cloud
  images: {
    guest: string
  }
}
