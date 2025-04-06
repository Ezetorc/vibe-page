import { useState, useEffect, useCallback } from 'react'
import { Dictionary } from '../models/Dictionary'
import { SettingsStore } from '../models/SettingsStore'
import { getSettingsStore } from '../stores/getSettingsStore'
import { Modal } from '../models/Modal'
import { ModalName } from '../models/ModalName'

export function useSettings () {
  const settingsStore: SettingsStore = getSettingsStore()
  const { language, dictionaries, setActiveModal } = settingsStore
  const [dictionary, setDictionary] = useState<Dictionary>({})

  const updateDictionary = useCallback(() => {
    if (!dictionaries) return

    setDictionary(dictionaries[language] ?? {})
  }, [dictionaries, language])

  useEffect(() => {
    updateDictionary()
  }, [dictionaries, language, updateDictionary])

  const openModal = useCallback(
    (name: ModalName, data: Modal['data'] = {}) => {
      setActiveModal({ name, data })
    },
    [setActiveModal]
  )

  const closeModal = useCallback(
    (data: Modal['data'] = {}) => {
      setActiveModal({ name: null, data })
    },
    [setActiveModal]
  )

  return { ...settingsStore, dictionary, openModal, closeModal }
}
