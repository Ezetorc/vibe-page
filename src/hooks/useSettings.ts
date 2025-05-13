import { useState, useEffect, useCallback } from 'react'
import { Dictionary } from '../models/Dictionary'
import { SettingsStore } from '../models/SettingsStore'
import { getSettingsStore } from '../stores/getSettingsStore'
import { ModalData } from '../models/ModalData'
import { ModalName } from '../models/ModalName'
import { Modal } from '../models/Modal'

export function useSettings () {
  const settingsStore: SettingsStore = getSettingsStore()
  const { language, dictionaries, setModal } = settingsStore
  const [dictionary, setDictionary] = useState<Dictionary>({})

  const updateDictionary = useCallback(() => {
    if (!dictionaries) return

    setDictionary(dictionaries[language] ?? {})
  }, [dictionaries, language])

  useEffect(() => {
    updateDictionary()
  }, [dictionaries, language, updateDictionary])

  const getMessage = (date: string | null | undefined) => {
    if (!date) return ''

    const [day, month, year] = date.split('/').map(Number)
    const fullYear = year < 100 ? 2000 + year : year
    const inputDate = new Date(fullYear, month - 1, day)
    const today = new Date()

    inputDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    const timeDiff = inputDate.getTime() - today.getTime()
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24)

    if (dayDiff === 0) return dictionary.today
    if (dayDiff === -1) return dictionary.yesterday
    return date
  }

  const openModal = useCallback(
    (name: ModalName, data?: ModalData) => {
      setModal(new Modal({ name, data }))
    },
    [setModal]
  )

  const closeModal = useCallback(
    (data?: ModalData) => {
      setModal(new Modal({ data }))
    },
    [setModal]
  )

  return { ...settingsStore, dictionary, openModal, closeModal, getMessage }
}
