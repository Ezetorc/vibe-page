import { Post } from '../../../models/Post'
import { User } from '../../../models/User'

export interface AccountData {
  user: User | null
  posts: Post[]
  editState: {
    field: 'name' | 'description' | null
    value: string
  }
  setEditState: React.Dispatch<
    React.SetStateAction<{
      field: 'name' | 'description' | null
      value: string
    }>
  >
  handleEdit: () => void
  isUser: boolean
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  isLoading: boolean
  isError: boolean
}
