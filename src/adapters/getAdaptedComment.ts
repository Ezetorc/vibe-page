import { Comment } from '../models/Comment'
import { CommentEndpoint } from '../models/CommentEndpoint'
import { User } from '../models/User'
import { LikeService } from '../services/LikeService'
import { UserService } from '../services/UserService'
import { getDate } from '../utilities/getDate'

export async function getAdaptedComment (params: {
  commentEndpoint: CommentEndpoint
  loggedUser: User | null
}): Promise<Comment> {
  const date = getDate(params.commentEndpoint.created_at)
  const [user, likes, userLiked] = await Promise.all([
    UserService.getById({ userId: params.commentEndpoint.user_id }),
    LikeService.getAmountOfComment({ commentId: params.commentEndpoint.id }),
    params.loggedUser?.hasLikedComment({ commentId: params.commentEndpoint.id })
  ])

  return new Comment({
    user: user!,
    likes,
    userLiked: Boolean(userLiked),
    id: params.commentEndpoint.id,
    date,
    postId: params.commentEndpoint.post_id,
    content: params.commentEndpoint.content
  })
}
