import { useState } from 'react'
import { useSettings } from '../../../hooks/useSettings'
import { useValidation } from '../../../hooks/useValidation'
import { User } from '../../../models/User'
import { useUser } from '../../../hooks/useUser'
import { EditState } from '../models/EditState'

export function useEditState (account: User | null): EditState {
  const { dictionary, openModal } = useSettings()
  const { updateUser } = useUser()
  const { validateName, validateDescription, errorMessage } = useValidation()
  const [editState, setEditState] = useState<{
    value: string
    field: 'name' | 'description' | null
  }>({
    value: '',
    field: null
  })

  const handleChangeName = async () => {
    if (!account || editState.value === account.name) {
      setEditState({ field: null, value: '' })
      return
    }

    const isNewNameValid = await validateName({ name: editState.value })
    const message = errorMessage || dictionary.errorDuringNameChange

    if (!isNewNameValid) {
      openModal('edit', { message })
      return
    }

    const nameChange = await account.changeName({ newName: editState.value })

    if (nameChange) {
      await updateUser(account.id)
    } else {
      openModal('edit', { message })
    }

    setEditState({ field: null, value: '' })
  }

  const handleChangeDescription = async () => {
    if (!account || editState.value === account.description) {
      setEditState({ field: null, value: '' })
      return
    }

    const isNewDescriptionValid = validateDescription({
      description: editState.value
    })
    const message = errorMessage || dictionary.errorDuringDescriptionChange

    if (!isNewDescriptionValid) {
      openModal('edit', { message })
      return
    }

    const descriptionChange = await account.changeDescription({
      newDescription: editState.value
    })

    if (descriptionChange) {
      await updateUser(account.id)
    } else {
      openModal('edit', { message })
    }

    setEditState({ field: null, value: '' })
  }

  const handleEdit = async () => {
    if (editState.field === 'name') {
      handleChangeName()
    } else if (editState.field === 'description') {
      handleChangeDescription()
    }
  }

  return {
    handle: handleEdit,
    field: editState.field,
    value: editState.value,
    set: setEditState
  }
}
