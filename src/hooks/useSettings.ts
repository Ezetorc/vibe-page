import { useState, useEffect, useCallback } from 'react'
import { Dictionary } from '../models/Dictionary'
import { SettingsStore } from '../models/SettingsStore'
import { getSettingsStore } from '../stores/getSettingsStore'

export function useSettings () {
  const settingsStore: SettingsStore = getSettingsStore()
  const { language, dictionaries } = settingsStore
  const [dictionary, setDictionary] = useState<Dictionary>({})

  const updateDictionary = useCallback(() => {
    if (!dictionaries) return

    setDictionary(dictionaries[language] ?? {})
  }, [dictionaries, language])

  useEffect(() => {
    updateDictionary()
  }, [updateDictionary])

  return { ...settingsStore, dictionary }
}
