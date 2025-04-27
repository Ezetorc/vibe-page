import { VIBE } from '../constants/VIBE'
import { Comment } from '../models/Comment'
import { CommentEndpoint } from '../models/CommentEndpoint'
import { User } from '../models/User'
import { getDate } from '../utilities/getDate'
import { LikeService } from './LikeService'
import { UserService } from './UserService'

export class CommentService {
  static async getFromEndpoint (params: {
    commentEndpoint: CommentEndpoint
    loggedUser: User | null
  }): Promise<Comment> {
    const date = getDate(params.commentEndpoint.created_at)
    const [user, likes, userLiked] = await Promise.all([
      UserService.getById({ userId: params.commentEndpoint.user_id }),
      LikeService.getAmountOfComment({ commentId: params.commentEndpoint.id }),
      params.loggedUser?.hasLikedComment({
        commentId: params.commentEndpoint.id
      })
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

  static async getAllOfPost (params: {
    postId: number
    amount?: number
    page?: number
    loggedUser: User | null
  }): Promise<Comment[]> {
    const response = await VIBE.get<CommentEndpoint[]>({
      endpoint: `comments/post/${params.postId}?amount=${
        params.amount ?? 6
      }&page=${params.page ?? 1}`
    })

    if (!response.value) return []

    const comments = await Promise.all(
      response.value.map(commentEndpoint =>
        this.getFromEndpoint({ commentEndpoint, loggedUser: params.loggedUser })
      )
    )

    return comments
  }

  static async getAmountOfPost (params: { postId: number }): Promise<number> {
    const response = await VIBE.get<number>({
      endpoint: `comments/post/amount/${params.postId}`
    })

    return response.value
  }

  static async create (params: {
    content: string
    postId: number
    userId: number
    loggedUser: User | null
  }): Promise<Comment | null> {
    const response = await VIBE.post<CommentEndpoint>({
      endpoint: 'comments',
      body: JSON.stringify({
        content: params.content,
        post_id: params.postId
      })
    })

    if (response.error) return null

    const comment = await this.getFromEndpoint({
      commentEndpoint: response.value!,
      loggedUser: params.loggedUser
    })

    return comment
  }

  static async delete (params: {
    commentId: number
    loggedUser: User | null
  }): Promise<Comment | null> {
    const response = await VIBE.delete<CommentEndpoint>({
      endpoint: `comments/${params.commentId}`
    })

    if (response.error) return null

    const commentLikes = await LikeService.getAllOfComment({
      commentId: params.commentId
    })
    const likesIds = commentLikes.map(commentLike => commentLike.id)

    await Promise.all(likesIds.map(likeId => LikeService.delete({ likeId })))

    const comment = await this.getFromEndpoint({
      commentEndpoint: response.value!,
      loggedUser: params.loggedUser
    })

    return comment
  }

  static async getById (params: {
    commentId: number
    loggedUser: User | null
  }): Promise<Comment | null> {
    const response = await VIBE.get<CommentEndpoint>({
      endpoint: `comments/${params.commentId}`
    })

    if (response.error) return null

    const comment = await this.getFromEndpoint({
      commentEndpoint: response.value!,
      loggedUser: params.loggedUser
    })

    return comment
  }
}
