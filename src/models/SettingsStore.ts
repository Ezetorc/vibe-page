import { Dictionaries } from './Dictionaries'
import { Language } from './Language'
import { ModalName } from './ModalName'

export interface SettingsStore {
  dictionaries: Dictionaries | null
  loadDictionaries: () => Promise<boolean>

  language: Language
  setLanguage: (newLanguage: Language) => void

  visibleModal: {
    name: ModalName | null
    data?: object | undefined
  }
  setVisibleModal: (newVisibleModal: {
    name: ModalName | null
    data?: object | undefined
  }) => void
}
