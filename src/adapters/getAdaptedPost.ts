import { Post } from '../models/Post'
import { PostEndpoint } from '../models/PostEndpoint'

export function getAdaptedPost (params: { postEndpoint: PostEndpoint }): Post {
  return new Post({
    id: params.postEndpoint.id,
    content: params.postEndpoint.content,
    userId: params.postEndpoint.user_id,
    createdAt: params.postEndpoint.created_at
  })
}
