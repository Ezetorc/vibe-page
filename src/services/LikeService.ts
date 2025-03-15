import { getAdaptedLike } from '../adapters/getAdaptedLike'
import { Like } from '../models/Like'
import { LikeEndpoint } from '../models/LikeEndpoint'
import { LikeType } from '../models/LikeType'
import { api } from '../constants/SETTINGS'

export class LikeService {
  static async getAllOfPost (args: { postId: number }): Promise<Like[]> {
    const response = await api.get<LikeEndpoint[]>({
      endpoint: `likes/all?type=post&id=${args.postId}`
    })

    if (!response.success) return []

    const likes = response.value!.map(likeEndpoint =>
      getAdaptedLike({ likeEndpoint })
    )

    return likes
  }

  static async getAllOfComment (args: { commentId: number }): Promise<Like[]> {
    const response = await api.get<LikeEndpoint[]>({
      endpoint: `likes/all?type=comment&id=${args.commentId}`
    })

    if (!response.success) return []

    const likes = response.value!.map(likeEndpoint =>
      getAdaptedLike({ likeEndpoint })
    )

    return likes
  }

  static async delete (args: {
    likeId: number
    signal?: AbortSignal
  }): Promise<boolean> {
    const response = await api.delete({
      endpoint: `likes/id?id=${args.likeId}`,
      signal: args.signal
    })

    return response.success
  }

  static async create (args: {
    userId: number
    targetId: number
    type: LikeType
    signal?: AbortSignal
  }): Promise<Like | null> {
    const response = await api.post<Like>({
      endpoint: `likes`,
      signal: args.signal,
      body: JSON.stringify({
        target_id: args.targetId,
        type: args.type,
        user_id: args.userId
      })
    })

    return response.value
  }
}
