import { API } from 'api-responser'
import { Settings } from '../models/Settings'

const settings: Settings = {
  api: new API({
    url: 'http://localhost:3000',
    formatToJson: true
  })
    .setDefaultHeaders({ 'Content-Type': 'application/json' })
    .setDefaultOptions({ credentials: 'include' }),
  defaultLanguage: 'en',
  languages: {
    en: 'English',
    es: 'Español'
  }
}

export const { api, languages, defaultLanguage } = settings
