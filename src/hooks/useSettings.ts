import { useState, useEffect } from "react"
import { Dictionary } from "../models/Dictionary"
import { SettingsStore } from "../models/SettingsStore"
import { getSettingsStore } from "../stores/getSettingsStore"

export function useSettings () {
  const settingsStore: SettingsStore = getSettingsStore()
  const { language, dictionaries } = settingsStore
  const [dictionary, setDictionary] = useState<Dictionary>({})

  useEffect(() => {
    if (!dictionaries) return
    
    setDictionary(dictionaries[language] ?? {})
  }, [language, dictionaries])

  return { ...settingsStore, dictionary }
}
