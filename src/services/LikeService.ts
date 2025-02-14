import { getAdaptedLike } from '../adapters/getAdaptedLike'
import { Data } from '../models/Data'
import { Like } from '../models/Like'
import { LikeEndpoint } from '../models/LikeEndpoint'
import { fetchAPI } from '../utilities/fetchAPI'

export class LikeService {
  static async getAllOfPost ({ postId }: { postId: number }): Promise<Data<Like[]>> {
    const response = await fetchAPI<LikeEndpoint[]>({
      url: `/likes/posts/id/${postId}`
    })

    if (!response.value) return Data.failure()

    const likes: Like[] = response.value.map(likeEndpoint =>
      getAdaptedLike({ likeEndpoint })
    )

    return Data.success(likes)
  }

  static async delete ({ likeId }: { likeId: number }): Promise<Data<boolean>> {
    const response = await fetchAPI({
      url: `/likes/id/${likeId}`,
      method: 'DELETE'
    })

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
    type: 'post' | 'comment'
  }): Promise<Data<boolean>> {
    const response = await fetchAPI<boolean>({
      url: `/likes`,
      method: 'POST',
      body: JSON.stringify({
        target_id: targetId,
        type: type,
        user_id: userId
      })
    })

    if (!response.value) return Data.failure()

    return Data.success(true)
  }
}
