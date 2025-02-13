import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
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

  const handleEdit = async () => {
    if (!account || !editState.field) return

    const isValid =
      editState.field === 'name'
        ? validateName({ name: editState.value })
        : validateDescription({ description: editState.value })

    if (!isValid) {
      return setVisibleModal({
        name: 'edit',
        message:
          errorMessage ||
          dictionary[
            `errorDuring${
              editState.field === 'name' ? 'Name' : 'Description'
            }Change`
          ]
      })
    }

    await (editState.field === 'name'
      ? account.changeName({ newName: editState.value })
      : account.changeDescription({ newDescription: editState.value }))

    await updateUser(account.id)
    setEditState({ field: null, value: '' })
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
  }, [fetchAccount])

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
