import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useUser } from '../../../hooks/useUser'
import { useValidation } from '../../../hooks/useValidation'
import { User } from '../../../models/User'
import { Post } from '../../../models/Post'
import { UserService } from '../../../services/UserService'
import { PostService } from '../../../services/PostService'
import { useSettings } from '../../../hooks/useSettings'

export function useAccount () {
  const { username } = useParams<{ username: string }>()
  const { setVisibleModal, dictionary } = useSettings()
  const navigate = useNavigate()
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

    if (!isNewNameValid) {
      setVisibleModal({
        name: 'edit',
        message: errorMessage || dictionary[`errorDuringNameChange`]
      })
      return
    }

    const nameChange = await account.changeName({ newName: editState.value })

    if (nameChange.success) {
      await updateUser(account.id)
      navigate(`/account/${editState.value}`)
      setEditState({ field: null, value: '' })
    } else {
      setEditState({ field: null, value: '' })
      setVisibleModal({
        name: 'edit',
        message: errorMessage || dictionary.errorDuringNameChange
      })
    }
  }

  const handleChangeDescription = async () => {
    if (!account) return

    const isNewDescriptionValid = validateDescription({
      description: editState.value
    })

    if (!isNewDescriptionValid) {
      setVisibleModal({
        name: 'edit',
        message: errorMessage || dictionary.errorDuringDescriptionChange
      })
      return
    }

    const descriptionChange = await account.changeDescription({
      newDescription: editState.value
    })

    if (descriptionChange.success) {
      await updateUser(account.id)
      setEditState({ field: null, value: '' })
    } else {
      setEditState({ field: null, value: '' })
      setVisibleModal({
        name: 'edit',
        message: errorMessage || dictionary.errorDuringDescriptionChange
      })
    }
  }

  const handleEdit = async () => {
    if (editState.field === 'name') {
      handleChangeName()
    } else if (editState.field === 'description') {
      handleChangeDescription()
    }
  }

  const handleSearch = async (query: string) => {
    if (!account) return

    const result =
      query.trim() === ''
        ? await account.getPosts()
        : await PostService.search({ query })

    if (result.value) setPosts(result.value)
  }

  useEffect(() => {
    fetchAccount()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    account,
    posts,
    editState,
    setEditState,
    handleEdit,
    handleSearch,
    accountIsUser,
    setPosts
  }
}
