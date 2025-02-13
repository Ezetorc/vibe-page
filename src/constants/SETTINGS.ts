import { Settings } from '../models/Settings'

const settings: Settings = {
  api: 'http://localhost:3000',
  defaultLanguage: "en",
  apiAbortSeconds: 20,
  languages: {
    en: 'English',
    es: 'Español'
  }
}

export const { api, languages, defaultLanguage, apiAbortSeconds } = settings
