import { Comment } from '../models/Comment'
import { CommentEndpoint } from '../models/CommentEndpoint'

export function getAdaptedComment (params: {
  commentEndpoint: CommentEndpoint
}): Comment {
  return new Comment({
    id: params.commentEndpoint.id,
    content: params.commentEndpoint.content,
    userId: params.commentEndpoint.user_id,
    createdAt: params.commentEndpoint.created_at,
    postId: params.commentEndpoint.post_id
  })
}
