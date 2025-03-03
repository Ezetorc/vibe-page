import { Like } from './Like'
import { User } from './User'

export interface CommentData {
  user: User | null
  likes: Like[] | null
  date: string | null
  userLiked: boolean | null
  id: number | null
  content: string | null
}
