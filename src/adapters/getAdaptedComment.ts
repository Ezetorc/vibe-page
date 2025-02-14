import { Comment } from '../models/Comment'
import { CommentEndpoint } from '../models/CommentEndpoint'

export function getAdaptedComment ({
  commentEndpoint
}: {
  commentEndpoint: CommentEndpoint
}): Comment {
  return new Comment({
    id: commentEndpoint.id,
    content: commentEndpoint.content,
    userId: commentEndpoint.user_id,
    createdAt: commentEndpoint.created_at,
    postId: commentEndpoint.post_id
  })
}
