import { getAdaptedComment } from '../adapters/getAdaptedComment'
import { VIBE } from '../constants/VIBE'
import { Comment } from '../models/Comment'
import { CommentEndpoint } from '../models/CommentEndpoint'
import { User } from '../models/User'
import { LikeService } from './LikeService'

export class CommentService {
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
        getAdaptedComment({ commentEndpoint, loggedUser: params.loggedUser })
      )
    )

    return comments
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

    if (!response.success) return null

    const comment = await getAdaptedComment({
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

    if (!response.success) return null

    const commentLikes = await LikeService.getAllOfComment({
      commentId: params.commentId
    })
    const likesIds = commentLikes.map(commentLike => commentLike.id)

    await Promise.all(likesIds.map(likeId => LikeService.delete({ likeId })))

    const comment = await getAdaptedComment({
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

    if (!response.success) return null

    const comment = await getAdaptedComment({
      commentEndpoint: response.value!,
      loggedUser: params.loggedUser
    })

    return comment
  }
}
