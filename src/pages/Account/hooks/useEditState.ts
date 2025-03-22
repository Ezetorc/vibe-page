import { useState } from 'react'
import { useSettings } from '../../../hooks/useSettings'
import { useValidation } from '../../../hooks/useValidation'
import { useUser } from '../../../hooks/useUser'
import { EditState } from '../models/EditState'
import { UserData } from '../models/UserData'
import { UserService } from '../../../services/UserService'

export function useEditState (userData: UserData): EditState {
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
    if (!userData.id || editState.value === userData.name) {
      setEditState({ field: null, value: '' })
      return
    }

    const isNewNameValid = await validateName({ name: editState.value })
    const message = errorMessage || dictionary.errorDuringNameChange

    if (!isNewNameValid) {
      openModal('edit', { message })
      return
    }

    const user = await UserService.getById({ userId: userData.id })
    const nameChange = await user!.changeName({ newName: editState.value })

    if (nameChange && userData.id) {
      await updateUser(userData.id)
    } else {
      openModal('edit', { message })
    }

    setEditState({ field: null, value: '' })
  }

  const handleChangeDescription = async () => {
    if (!userData.id || editState.value === userData.description) {
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

    const user = await UserService.getById({ userId: userData.id })
    const descriptionChange = await user!.changeDescription({
      newDescription: editState.value
    })

    if (descriptionChange && userData.id) {
      await updateUser(userData.id)
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
