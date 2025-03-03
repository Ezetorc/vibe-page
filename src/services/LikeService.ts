import { getAdaptedLike } from '../adapters/getAdaptedLike'
import { Like } from '../models/Like'
import { LikeEndpoint } from '../models/LikeEndpoint'
import { Data } from '../models/Data'
import { LikeType } from '../models/LikeType'
import { api } from '../constants/SETTINGS'

export class LikeService {
  static async getAllOfPost ({
    postId
  }: {
    postId: number
  }): Promise<Data<Like[]>> {
    const response = await api.get<LikeEndpoint[]>({
      endpoint: `likes/posts/id/${postId}`
    })

    if (!response.value) return Data.failure()
    const likes: Like[] = response.value.map(likeEndpoint =>
      getAdaptedLike({ likeEndpoint })
    )

    return Data.success(likes)
  }

  static async getAllOfComment ({
    commentId
  }: {
    commentId: number
  }): Promise<Data<Like[]>> {
    const response = await api.get<LikeEndpoint[]>({
      endpoint: `likes/comments/id/${commentId}`
    })

    if (!response.value) return Data.failure()

    const likes: Like[] = response.value.map(likeEndpoint =>
      getAdaptedLike({ likeEndpoint })
    )

    return Data.success(likes)
  }

  static async delete ({ likeId }: { likeId: number }): Promise<Data<boolean>> {
    const response = await api.delete({ endpoint: `likes/id/${likeId}` })

    if (!response.value) return Data.failure()

    return Data.success(true)
  }

  static async create ({
    userId,
    targetId,
    type
  }: {
    userId: number
    targetId: number
    type: LikeType
  }): Promise<Data<Like>> {
    const response = await api.post<Like>({
      endpoint: `likes`,
      body: JSON.stringify({
        target_id: targetId,
        type: type,
        user_id: userId
      })
    })

    return response
  }
}
