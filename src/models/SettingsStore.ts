import { Dictionaries } from './Dictionaries'
import { Language } from './Language'
import { ModalName } from './ModalName'

export interface SettingsStore {
  dictionaries: Dictionaries | null
  loadDictionaries: () => Promise<void>

  language: Language
  setLanguage: (newLanguage: Language) => void

  visibleModal: {
    name: ModalName | null
    message?: string | undefined
    data?: object | undefined
  }
  setVisibleModal: (newVisibleModal: {
    name: ModalName | null
    message?: string | undefined
    data?: object | undefined
  }) => void
}
