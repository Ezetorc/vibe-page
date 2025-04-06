import { getAdaptedLike } from '../adapters/getAdaptedLike'
import { VIBE } from '../constants/VIBE'
import { Like } from '../models/Like'
import { LikeEndpoint } from '../models/LikeEndpoint'
import { LikeType } from '../models/LikeType'

export class LikeService {
  static async getAllOfPost (params: { postId: number }): Promise<Like[]> {
    const response = await VIBE.get<LikeEndpoint[]>({
      endpoint: `likes/?type=post&targetId=${params.postId}`
    })

    if (!response.success) return []

    const likes = response.value!.map(likeEndpoint =>
      getAdaptedLike({ likeEndpoint })
    )

    return likes
  }

  static async getAllOfComment (params: { commentId: number }): Promise<Like[]> {
    const response = await VIBE.get<LikeEndpoint[]>({
      endpoint: `likes/?type=comment&targetId=${params.commentId}`
    })

    if (!response.success) return []

    const likes = response.value!.map(likeEndpoint =>
      getAdaptedLike({ likeEndpoint })
    )

    return likes
  }

  static async getAmountOfPost (params: { postId: number }): Promise<number> {
    const response = await VIBE.get<number>({
      endpoint: `likes/count?type=post&targetId=${params.postId}`
    })

    if (response.success) {
      return response.value
    } else {
      return -1
    }
  }

  static async getAmountOfComment (params: {
    commentId: number
  }): Promise<number> {
    const response = await VIBE.get<number>({
      endpoint: `likes/count?type=comment&targetId=${params.commentId}`
    })

    if (response.success) {
      return response.value
    } else {
      return -1
    }
  }

  static async delete (params: {
    likeId: number
    signal?: AbortSignal
  }): Promise<boolean> {
    const response = await VIBE.delete({
      endpoint: `likes/${params.likeId}`,
      signal: params.signal
    })

    return response.success
  }

  static async create (params: {
    userId: number
    targetId: number
    type: LikeType
    signal?: AbortSignal
  }): Promise<Like | null> {
    const response = await VIBE.post<LikeEndpoint>({
      endpoint: `likes`,
      signal: params.signal,
      body: JSON.stringify({
        target_id: params.targetId,
        type: params.type
      })
    })

    if (!response.success) return null

    const like = getAdaptedLike({ likeEndpoint: response.value })

    return like
  }
}
