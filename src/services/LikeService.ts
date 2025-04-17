import { VIBE } from '../constants/VIBE'
import { Like } from '../models/Like'
import { LikeEndpoint } from '../models/LikeEndpoint'
import { LikeType } from '../models/LikeType'

export class LikeService {
  static getFromEndpoint (params: { likeEndpoint: LikeEndpoint }): Like {
    return new Like({
      id: params.likeEndpoint.id,
      type: params.likeEndpoint.type as LikeType,
      targetId: params.likeEndpoint.target_id,
      userId: params.likeEndpoint.user_id
    })
  }

  static async getAllOfPost (params: { postId: number }): Promise<Like[]> {
    const response = await VIBE.get<LikeEndpoint[]>({
      endpoint: `likes/?type=post&targetId=${params.postId}`
    })

    if (!response.success) return []

    const likes = response.value!.map(likeEndpoint =>
      this.getFromEndpoint({ likeEndpoint })
    )

    return likes
  }

  static async getAllOfComment (params: { commentId: number }): Promise<Like[]> {
    const response = await VIBE.get<LikeEndpoint[]>({
      endpoint: `likes/?type=comment&targetId=${params.commentId}`
    })

    if (!response.success) return []

    const likes = response.value!.map(likeEndpoint =>
      this.getFromEndpoint({ likeEndpoint })
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

    const like = this.getFromEndpoint({ likeEndpoint: response.value })

    return like
  }
}
