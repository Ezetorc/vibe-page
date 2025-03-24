const envData = {
  CLOUD_NAME: import.meta.env.VITE_CLOUD_NAME ?? '',
  API_URL: import.meta.env.VITE_API_URL ?? ''
}
import { Settings } from '../models/Settings'
import { Cloud } from '../models/Cloud'
import { API } from '../models/API'
import { Session } from '../models/Session'

const session = Session.get()
const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json'
}

if (session) {
  defaultHeaders['Authorization'] = `Bearer ${session}`
}

const settings: Settings = {
  api: new API({ url: envData.API_URL, formatToJson: true })
    .setDefaultHeaders(defaultHeaders)
    .setDefaultOptions({ credentials: 'include' }),
  defaultLanguage: 'en',
  languages: {
    en: 'English',
    es: 'Español'
  },
  cloudinary: new Cloud({ cloud: { cloudName: envData.CLOUD_NAME } }),
  images: {
    guest: '/guest_user.webp'
  }
}

export const { api, languages, defaultLanguage, cloudinary, images } = settings
