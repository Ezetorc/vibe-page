import { getAdaptedComment } from '../adapters/getAdaptedComment'
import { VIBE } from '../constants/VIBE'
import { Comment } from '../models/Comment'
import { CommentEndpoint } from '../models/CommentEndpoint'
import { LikeService } from './LikeService'

export class CommentService {
  static async getAllOfPost (params: {
    postId: number
    amount?: number
    page?: number
  }): Promise<Comment[]> {
    const response = await VIBE.get<CommentEndpoint[]>({
      endpoint: `comments/post/${params.postId}&amount=${params.amount ?? 6}&page=${
        params.page ?? 1
      }`
    })

    if (!response.value) return []

    const comments = response.value.map(commentEndpoint =>
      getAdaptedComment({ commentEndpoint })
    )

    return comments
  }

  static async create (params: {
    content: string
    postId: number
    userId: number
  }): Promise<Comment | null> {
    const response = await VIBE.post<CommentEndpoint>({
      endpoint: 'comments',
      body: JSON.stringify({
        content: params.content,
        post_id: params.postId
      })
    })

    if (!response.success) return null

    const comment = getAdaptedComment({ commentEndpoint: response.value! })

    return comment
  }

  static async delete (params: { commentId: number }): Promise<Comment | null> {
    const response = await VIBE.delete<CommentEndpoint>({
      endpoint: `comments/${params.commentId}`
    })

    if (!response.success) return null

    const commentLikes = await LikeService.getAllOfComment({
      commentId: params.commentId
    })
    const likesIds = commentLikes.map(commentLike => commentLike.id)

    await Promise.all(likesIds.map(likeId => LikeService.delete({ likeId })))

    const comment = getAdaptedComment({ commentEndpoint: response.value! })

    return comment
  }

  static async getById (params: { commentId: number }): Promise<Comment | null> {
    const response = await VIBE.get<CommentEndpoint>({
      endpoint: `comments/${params.commentId}`
    })

    if (!response.success) return null

    const comment = getAdaptedComment({
      commentEndpoint: response.value!
    })

    return comment
  }
}
