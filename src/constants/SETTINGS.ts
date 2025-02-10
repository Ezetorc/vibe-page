import { Settings } from '../models/Settings'

const SETTINGS: Settings = {
  api: 'http://localhost:3000',
  defaultLanguage: "en",
  languages: {
    en: 'English',
    es: 'Español'
  }
}

export const { api, languages, defaultLanguage } = SETTINGS
