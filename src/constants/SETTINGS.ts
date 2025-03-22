const envData = {
  API_KEY: import.meta.env.VITE_API_KEY ?? '',
  CLOUD_NAME: import.meta.env.VITE_CLOUD_NAME ?? '',
  API_URL: import.meta.env.VITE_API_URL ?? ''
}
import { Settings } from '../models/Settings'
import { Cloud } from '../models/Cloud'
import { API } from '../models/API'

const settings: Settings = {
  api: new API({
    url: envData.API_URL,
    formatToJson: true
  })
    .setDefaultHeaders({
      'Content-Type': 'application/json',
      'x-api-key': envData.API_KEY
    })
    .setDefaultOptions({ credentials: 'include' }),
  defaultLanguage: 'en',
  languages: {
    en: 'English',
    es: 'Español'
  },
  cloudinary: new Cloud({ cloud: { cloudName: envData.CLOUD_NAME } })
}

export const { api, languages, defaultLanguage, cloudinary } =
  settings
