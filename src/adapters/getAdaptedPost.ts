import { Post } from '../models/Post'
import { PostEndpoint } from '../models/PostEndpoint'
import { User } from '../models/User'
import { CommentService } from '../services/CommentService'
import { LikeService } from '../services/LikeService'
import { UserService } from '../services/UserService'
import { getDate } from '../utilities/getDate'

export async function getAdaptedPost (params: {
  postEndpoint: PostEndpoint
  loggedUser: User | null
}): Promise<Post> {
  const date = getDate(params.postEndpoint.created_at)
  const [user, likes, comments, userLiked] = await Promise.all([
    UserService.getById({ userId: params.postEndpoint.user_id }),
    LikeService.getAmountOfPost({ postId: params.postEndpoint.id }),
    CommentService.getAllOfPost({
      postId: params.postEndpoint.id,
      loggedUser: params.loggedUser
    }),
    params.loggedUser?.hasLikedPost({ postId: params.postEndpoint.id })
  ])

  return new Post({
    id: params.postEndpoint.id,
    content: params.postEndpoint.content,
    user: user!,
    date,
    likes,
    comments,
    userLiked: Boolean(userLiked)
  })
}
