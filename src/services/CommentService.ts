import { getAdaptedComment } from '../adapters/getAdaptedComment'
import { Comment } from '../models/Comment'
import { CommentEndpoint } from '../models/CommentEndpoint'
import { api } from '../constants/SETTINGS'

export class CommentService {
  static async getAll (
    args: {
      amount?: number
      page?: number
    } = {}
  ): Promise<Comment[]> {
    const response = await api.get<CommentEndpoint[]>({
      endpoint: `comments/all?amount=${args.amount ?? 6}&page=${args.page ?? 1}`
    })

    if (!response.value) return []

    const comments = response.value.map(commentEndpoint =>
      getAdaptedComment({ commentEndpoint })
    )

    return comments
  }

  static async create (args: {
    content: string
    postId: number
    userId: number
  }): Promise<Comment | null> {
    const response = await api.post<CommentEndpoint>({
      endpoint: 'comments',
      body: JSON.stringify({
        content: args.content,
        post_id: args.postId,
        user_id: args.userId
      })
    })

    if (!response.success) return null

    const comment = getAdaptedComment({ commentEndpoint: response.value! })

    return comment
  }

  static async getById (args: { commentId: number }): Promise<Comment | null> {
    const response = await api.get<CommentEndpoint>({
      endpoint: `comments/id?id=${args.commentId}`
    })

    if (!response.success) return null

    const comment = getAdaptedComment({
      commentEndpoint: response.value!
    })

    return comment
  }
}
