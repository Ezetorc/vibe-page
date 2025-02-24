import { Comment } from './Comment'
import { Like } from './Like'
import { User } from './User'

export interface PostData {
  user: User | null
  likes: Like[] | null
  comments: Comment[] | null
  date: string | null
  userLiked: boolean | null
  id: number | null
  content: string | null
}
