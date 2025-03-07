import { useCallback, useEffect, useMemo, useState } from 'react'
import { UserService } from '../../../services/UserService'
import { AccountData } from '../models/AccountData'
import { User } from '../../../models/User'
import { useUser } from '../../../hooks/useUser'
import { Post } from '../../../models/Post'
import { useSettings } from '../../../hooks/useSettings'
import { useValidation } from '../../../hooks/useValidation'

export function useAccountData (username: string | undefined): AccountData {
  const { user, updateUser } = useUser()
  const { dictionary, openModal } = useSettings()
  const { validateName, validateDescription, errorMessage } = useValidation()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [account, setAccount] = useState<User | null>(null)
  const accountIsUser = useMemo(() => user?.id === account?.id, [user, account])
  const [editState, setEditState] = useState<{
    field: 'name' | 'description' | null
    value: string
  }>({ field: null, value: '' })
  const [posts, setPosts] = useState<Post[]>([])

  const fetchAccount = useCallback(async () => {
    if (username === 'me') {
      setAccount(user)
    } else if (username) {
      const newAccount = await UserService.getByName({ name: username })

      if (newAccount) {
        setAccount(newAccount)
        setEditState({ field: null, value: '' })
        setPosts([])
      } else {
        setIsLoading(false)
        setIsError(true)
      }
    } else {
      setIsError(true)
      setIsLoading(false)
    }
  }, [user, username])

  const handleChangeName = async () => {
    if (!account) return

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
    if (!account) return

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

  useEffect(() => {
    fetchAccount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return {
    isLoading,
    isError,
    user: account,
    posts,
    editState,
    setEditState,
    handleEdit,
    isUser: accountIsUser,
    setPosts
  }
}
