import { create } from 'zustand'
import { SettingsStore } from '../models/SettingsStore'
import { Language } from '../models/Language'
import { getDictionaries } from '../utilities/getDictionaries'
import { Dictionaries } from '../models/Dictionaries'
import { LanguageService } from '../services/LanguageService'
import { Modal } from '../models/Modal'

export const getSettingsStore = create<SettingsStore>(set => ({
  dictionaries: null,
  loadDictionaries: async () => {
    const dictionaries: Dictionaries = await getDictionaries()

    if (dictionaries) {
      set({ dictionaries })
      return true
    } else {
      return false
    }
  },

  language: LanguageService.get(),
  setLanguage: (newLanguage: Language) => set({ language: newLanguage }),

  activeModal: {
    name: null,
    data: undefined
  },
  setActiveModal: (newActiveModal: Modal) =>
    set({ activeModal: newActiveModal })
}))
