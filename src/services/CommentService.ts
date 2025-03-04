import { getAdaptedComment } from '../adapters/getAdaptedComment'
import { Comment } from '../models/Comment'
import { CommentEndpoint } from '../models/CommentEndpoint'
import { Data } from '../models/Data'
import { api } from '../constants/SETTINGS'

export class CommentService {
  static async getAll ({
    amount = 10,
    page = 1
  }: {
    amount?: number
    page?: number
  } = {}): Promise<Data<Comment[]>> {
    const response = await api.get<CommentEndpoint[]>({
      endpoint: `comments?amount=${amount}&page=${page}`
    })

    if (!response.value) return Data.failure()

    const comments = response.value.map(commentEndpoint =>
      getAdaptedComment({ commentEndpoint })
    )

    return Data.success(comments)
  }

  static async create ({
    content,
    postId,
    userId
  }: {
    content: string
    postId: number
    userId: number
  }): Promise<Data<Comment>> {
    const response = await api.post<CommentEndpoint | null>({
      endpoint: 'comments',
      body: JSON.stringify({
        content,
        post_id: postId,
        user_id: userId
      })
    })

    if (response.value == null) return Data.failure()

    const comment = getAdaptedComment({ commentEndpoint: response.value })

    return Data.success(comment)
  }

  static async getById ({
    commentId
  }: {
    commentId: number
  }): Promise<Data<Comment>> {
    const response = await api.get<CommentEndpoint>({
      endpoint: `comments/id/${commentId}`
    })

    if (!response.value) return Data.failure()

    const comment = getAdaptedComment({
      commentEndpoint: response.value
    })

    return Data.success(comment)
  }
}
