import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { useUser } from '../../../hooks/useUser'
import { useValidation } from '../../../hooks/useValidation'
import { User } from '../../../models/User'
import { Post } from '../../../models/Post'
import { UserService } from '../../../services/UserService'
import { useSettings } from '../../../hooks/useSettings'

export function useAccount () {
  const { username } = useParams<{ username: string }>()
  const { openModal, dictionary } = useSettings()
  const { errorMessage, validateName, validateDescription } = useValidation()
  const { updateUser, user } = useUser()
  const [account, setAccount] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [editState, setEditState] = useState<{
    field: 'name' | 'description' | null
    value: string
  }>({ field: null, value: '' })
  const accountIsUser = useMemo(() => user?.id === account?.id, [user, account])

  const fetchAccount = useCallback(async () => {
    if (username === 'me') {
      setAccount(user)
    } else if (username) {
      const newAccount = await UserService.getByUsername({ username })

      setAccount(newAccount.value)
      setEditState({ field: null, value: '' })
      setPosts([])
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

    if (nameChange.success) {
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

    if (descriptionChange.success) {
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
  }, [])

  return {
    user: account,
    posts,
    editState,
    setEditState,
    handleEdit,
    isUser: accountIsUser,
    setPosts
  }
}
