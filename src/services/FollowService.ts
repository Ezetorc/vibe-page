import { VIBE } from '../constants/VIBE'

export class FollowService {
  static async create (params: { followingId: number }): Promise<boolean> {
    const response = await VIBE.post({
      endpoint: `follows/${params.followingId}`
    })

    return !response.error
  }

  static async delete (params: { followingId: number }): Promise<boolean> {
    const response = await VIBE.delete({
      endpoint: `follows/${params.followingId}`
    })

    return !response.error
  }

  static async exists (params: {
    followerId: number
    followingId: number
  }): Promise<boolean> {
    const response = await VIBE.get<boolean>({
      endpoint: `follows/exists?followerId=${params.followerId}&followingId=${params.followingId}`
    })

    return Boolean(response.value)
  }

  static async getIdsOfUser (params: { userId: number }): Promise<number[]> {
    const response = await VIBE.get<number[]>({
      endpoint: `follows/?userId=${params.userId}`
    })

    if (!response.value) return []

    return response.value
  }

  static async getFollowersAmount (params: { userId: number }): Promise<number> {
    const response = await VIBE.get<number>({
      endpoint: `follows/count?userId=${params.userId}&type=following`
    })

    if (!response.error) {
      return response.value
    } else {
      return -1
    }
  }

  static async getFollowingAmount (params: { userId: number }): Promise<number> {
    const response = await VIBE.get<number>({
      endpoint: `follows/count?userId=${params.userId}&type=follower`
    })

    if (!response.error) {
      return response.value
    } else {
      return -1
    }
  }
}
