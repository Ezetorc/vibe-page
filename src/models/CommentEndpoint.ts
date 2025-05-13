import { SimplifiedUserEndpoint } from './SimplifiedUserEndpoint'

export interface CommentEndpoint {
  id: number
  user: SimplifiedUserEndpoint
  post_id: number
  content: string
  created_at: string
  likes: number
}
