import { Modal } from './Modal'
import { Dictionaries } from './Dictionaries'
import { Language } from './Language'

export interface SettingsStore {
  dictionaries: Dictionaries | null
  loadDictionaries: () => Promise<boolean>

  language: Language
  setLanguage: (newLanguage: Language) => void

  activeModal: Modal
  setActiveModal: (newActiveModal: Modal) => void
}
