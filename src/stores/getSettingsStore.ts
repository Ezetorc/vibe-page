import { create } from 'zustand'
import { SettingsStore } from '../models/SettingsStore'
import { Language } from '../models/Language'
import { getDictionaries } from '../utilities/getDictionaries'
import { Dictionaries } from '../models/Dictionaries'
import { getLanguage } from '../utilities/getLanguage'

export const getSettingsStore = create<SettingsStore>(set => ({
  dictionaries: null,
  loadDictionaries: async () => {
    const data: Dictionaries = await getDictionaries()
    set({ dictionaries: data })
  },

  changeLanguageModalVisible: false,
  setChangeLanguageModalVisible: (newChangeLanguageModalVisible: boolean) =>
    set({ changeLanguageModalVisible: newChangeLanguageModalVisible }),

  language: getLanguage(),
  setLanguage: (newLanguage: Language) => set({ language: newLanguage }),

  sessionModalVisible: false,
  setSessionModalVisible: newSessionModalVisible =>
    set({ sessionModalVisible: newSessionModalVisible }),

  changeEmailModalVisible: false,
  setChangeEmailModalVisible: newChangeEmailModalVisible =>
    set({ changeEmailModalVisible: newChangeEmailModalVisible }),

  invalidEditModalConfig: {
    visible: false,
    errorMessage: 'Try again.'
  },
  setInvalidEditModalConfig: newInvalidEditModalConfig =>
    set({ invalidEditModalConfig: newInvalidEditModalConfig })
}))
