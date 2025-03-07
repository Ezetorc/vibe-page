import { Post } from '../models/Post'
import { PostData } from '../models/PostData'
import { User } from '../models/User'
import { UserService } from '../services/UserService'

export async function getPostData (
  post: Post,
  user: User | null
): Promise<PostData> {
  const [newUser, newLikes, newComments, newUserLiked] = await Promise.all([
    UserService.getById({ userId: post.userId }),
    post.getLikes(),
    post.getComments(),
    user?.hasLikedPost({ postId: post.id })
  ])

  const postData: PostData = {
    user: newUser,
    likes: newLikes,
    comments: newComments,
    userLiked: Boolean(newUserLiked),
    id: post.id,
    date: post.getDate(),
    content: post.content
  }

  return postData
}
