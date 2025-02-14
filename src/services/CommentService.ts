import { Data } from 'api-responser'
import { getAdaptedComment } from '../adapters/getAdaptedComment'
import { Comment } from '../models/Comment'
import { CommentEndpoint } from '../models/CommentEndpoint'
import { api } from '../constants/SETTINGS'

export class CommentService {
  static async getAll (): Promise<Data<Comment[]>> {
    const response = await api.get<CommentEndpoint[]>({ endpoint: `comments` })

    if (!response.value) return Data.failure()

    const comments = response.value.map(commentEndpoint =>
      getAdaptedComment({ commentEndpoint })
    )

    return Data.success(comments)
  }

  static async getById ({
    commentId
  }: {
    commentId: number
  }): Promise<Data<Comment>> {
    const response = await api.get<CommentEndpoint>({ endpoint: `comments/id/${commentId}` })

    if (!response.value) return Data.failure()

    const comment = getAdaptedComment({
      commentEndpoint: response.value
    })

    return Data.success(comment)
  }
}
