import { Comment } from './Comment'
import { User } from './User'

export interface PostData {
  user: User | null
  likes: number | null
  comments: Comment[] | null
  date: string | null
  userLiked: boolean | null
  id: number | null
  content: string | null
}
