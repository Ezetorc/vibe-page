import { Post } from '../models/Post'
import { PostEndpoint } from '../models/PostEndpoint'

export function getAdaptedPost (postEndpoint: PostEndpoint): Post {
  return new Post({
    id: postEndpoint.id,
    content: postEndpoint.content,
    userId: postEndpoint.user_id,
    createdAt: postEndpoint.created_at
  })
}
