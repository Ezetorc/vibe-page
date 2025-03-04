import { Settings } from '../models/Settings'
import { Cloud } from '../models/Cloud'
import { API } from '../models/API'

const settings: Settings = {
  api: new API({
    url: 'https://vibe-api-production.up.railway.app',
    formatToJson: true
  })
    .setDefaultHeaders({ 'Content-Type': 'application/json' })
    .setDefaultOptions({ credentials: 'include' }),
  defaultLanguage: 'en',
  languages: {
    en: 'English',
    es: 'Español'
  },
  cloudinary: new Cloud({ cloud: { cloudName: 'ddugvrea9' } })
}

export const { api, languages, defaultLanguage, cloudinary } = settings
