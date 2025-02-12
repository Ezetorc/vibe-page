import { getAdaptedLike } from '../adapters/getAdaptedLike'
import { Data } from '../models/Data'
import { Like } from '../models/Like'
import { LikeEndpoint } from '../models/LikeEndpoint'
import { fetchAPI } from '../utilities/fetchAPI'

export class LikeService {
  static async getAll (): Promise<Data<Like[]>> {
    const response = await fetchAPI<LikeEndpoint[]>({
      url: `/likes`,
      credentials: 'include'
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
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.value) return Data.failure()

    return Data.success(true)
  }

  static async create ({
    userId,
    postId
  }: {
    userId: number
    postId: number
  }): Promise<Data<boolean>> {
    const response = await fetchAPI({
      url: `/likes`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        post_id: postId,
        user_id: userId
      })
    })

    if (!response.value) return Data.failure()

    return Data.success(true)
  }
}
