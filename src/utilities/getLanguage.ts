import { defaultLanguage } from "../constants/settings"
import { Language } from "../models/Language"

export function getLanguage (): Language {
  const storagedLanguage = localStorage.getItem('language')

  if (storagedLanguage === null) return defaultLanguage
  
  return storagedLanguage as Language
}
