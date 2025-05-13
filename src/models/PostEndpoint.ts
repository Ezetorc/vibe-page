import { SimplifiedUserEndpoint } from './SimplifiedUserEndpoint'

export interface PostEndpoint {
  id: number
  user: SimplifiedUserEndpoint
  content: string
  created_at: string
  likes: number
  comments: number
}
