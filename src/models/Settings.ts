import { Language } from './Language'
import { Cloud } from './Cloud'
import { API } from './API'
import { QueryClient } from '@tanstack/react-query'

export interface Settings {
  api: API
  languages: { [key in Language]: string }
  defaultLanguage: Language
  cloudinary: Cloud
  queryClient: QueryClient
}
