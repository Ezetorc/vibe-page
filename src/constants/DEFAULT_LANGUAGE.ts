import { Language } from '../models/Language'
import { LANGUAGES } from './LANGUAGES'

const browserLanguage = (navigator.language || 'en').slice(0, 2) as Language

export const DEFAULT_LANGUAGE: Language = Object.keys(LANGUAGES).includes(
  browserLanguage
)
  ? browserLanguage
  : 'en'
