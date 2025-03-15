import { useState, useEffect, useCallback } from 'react'
import { Dictionary } from '../models/Dictionary'
import { SettingsStore } from '../models/SettingsStore'
import { getSettingsStore } from '../stores/getSettingsStore'
import { ModalName } from '../models/ModalName'

export function useSettings () {
  const settingsStore: SettingsStore = getSettingsStore()
  const { language, dictionaries, setVisibleModal } = settingsStore
  const [dictionary, setDictionary] = useState<Dictionary>({})

  const updateDictionary = useCallback(() => {
    if (!dictionaries) return

    setDictionary(dictionaries[language] ?? {})
  }, [dictionaries, language])

  useEffect(() => {
    updateDictionary()
  }, [dictionaries, language, updateDictionary])

  const openModal = useCallback(
    (modalName: ModalName, data: object | undefined = {}) => {
      setVisibleModal({
        name: modalName,
        data
      })
    },
    [setVisibleModal]
  )

  const closeModal = useCallback(
    (data: object | undefined = {}) => {
      setVisibleModal({ name: null, data })
    },
    [setVisibleModal]
  )

  return { ...settingsStore, dictionary, openModal, closeModal }
}
