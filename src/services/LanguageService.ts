import { DEFAULT_LANGUAGE } from '../constants/DEFAULT_LANGUAGE'
import { Language } from '../models/Language'

export class LanguageService {
  private static _key: string = 'vibe_language'

  static get () {
    const storagedLanguage = localStorage.getItem(this._key)

    if (storagedLanguage) {
      return storagedLanguage as Language
    } else {
      return DEFAULT_LANGUAGE
    }
  }

  static set (newLanguage: string) {
    localStorage.setItem(this._key, newLanguage)
  }
}
