import { Dictionaries } from './Dictionaries'
import { Language } from './Language'
import { Modal } from './Modal'

export interface SettingsStore {
  dictionaries: Dictionaries | null
  loadDictionaries: () => Promise<boolean>

  language: Language
  setLanguage: (newLanguage: Language) => void

  modal: Modal
  setModal: (newModal: Modal) => void
}
