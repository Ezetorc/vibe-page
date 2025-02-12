import { create } from 'zustand'
import { SettingsStore } from '../models/SettingsStore'
import { Language } from '../models/Language'
import { getDictionaries } from '../utilities/getDictionaries'
import { Dictionaries } from '../models/Dictionaries'
import { getLanguage } from '../utilities/getLanguage'
import { ModalName } from '../models/VisibleModal'

export const getSettingsStore = create<SettingsStore>(set => ({
  dictionaries: null,
  loadDictionaries: async () => {
    const data: Dictionaries = await getDictionaries()
    set({ dictionaries: data })
  },

  language: getLanguage(),
  setLanguage: (newLanguage: Language) => set({ language: newLanguage }),

  visibleModal: {
    name: null,
    message: undefined
  },
  setVisibleModal: (newVisibleModal: {
    name: ModalName | null
    message?: string | undefined
  }) => set({ visibleModal: newVisibleModal })
}))
