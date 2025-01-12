import { SettingsStore } from '../models/SettingsStore'
import { getSettingsStore } from '../stores/getSettingsStore'

export function useSettings () {
  const settingsStore: SettingsStore = getSettingsStore()

  return { ...settingsStore }
}
