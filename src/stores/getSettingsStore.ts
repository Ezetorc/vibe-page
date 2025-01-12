import { create } from 'zustand'
import { SettingsStore } from '../models/SettingsStore'

export const getSettingsStore = create<SettingsStore>(set => ({
  sessionModalVisible: false,
  setSessionModalVisible: newSessionModalVisible =>
    set({ sessionModalVisible: newSessionModalVisible })
}))
