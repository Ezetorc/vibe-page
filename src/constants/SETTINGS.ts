const envData = {
  API_KEY: import.meta.env.VITE_API_KEY
}
import { Settings } from '../models/Settings'
import { Cloud } from '../models/Cloud'
import { API } from '../models/API'
import { QueryClient } from '@tanstack/react-query'

const settings: Settings = {
  api: new API({
    url: 'http://localhost:3000',
    formatToJson: true
  })
    .setDefaultHeaders({
      'Content-Type': 'application/json',
      'x-api-key': envData.API_KEY ?? ''
    })
    .setDefaultOptions({ credentials: 'include' }),
  defaultLanguage: 'en',
  languages: {
    en: 'English',
    es: 'Español'
  },
  cloudinary: new Cloud({ cloud: { cloudName: 'ddugvrea9' } }),
  queryClient: new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  })
}

export const { api, languages, defaultLanguage, cloudinary, queryClient } =
  settings
