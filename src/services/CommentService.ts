import { getAdaptedComment } from '../adapters/getAdaptedComment'
import { Comment } from '../models/Comment'
import { CommentEndpoint } from '../models/CommentEndpoint'
import { Data } from '../models/Data'
import { fetchAPI } from '../utilities/fetchAPI'

export class CommentService {
  static async getAll (): Promise<Data<Comment[]>> {
    const response = await fetchAPI<CommentEndpoint[]>({
      url: `/comments`
    })

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
    const response = await fetchAPI<CommentEndpoint>({
      url: `/comments/id/${commentId}`
    })

    if (!response.value) return Data.failure()

    const comment = getAdaptedComment({
      commentEndpoint: response.value
    })

    return Data.success(comment)
  }
}
