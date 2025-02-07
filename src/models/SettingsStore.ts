import { Dictionaries } from "./Dictionaries"
import { Language } from "./Language"

export interface SettingsStore {
  dictionaries: Dictionaries | null
  loadDictionaries: () => Promise<void>

  language: Language
  setLanguage: (newLanguage: Language) => void

  sessionModalVisible: boolean
  setSessionModalVisible: (newSessionModalVisible: boolean) => void

  changeLanguageModalVisible: boolean
  setChangeLanguageModalVisible: (newChangeLanguageModalVisible: boolean) => void

  changeEmailModalVisible: boolean
  setChangeEmailModalVisible: (newChangeEmailModalVisible: boolean) => void

  invalidEditModalConfig: {
    visible: boolean
    errorMessage: string
  }
  setInvalidEditModalConfig: (newInvalidEditModalConfig: {
    visible: boolean
    errorMessage: string
  }) => void
}
