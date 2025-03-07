import { api } from '../constants/SETTINGS'

export class FollowerService {
  static async create (args: {
    followerId: number
    followingId: number
  }): Promise<boolean> {
    const response = await api.post({
      endpoint: `followers`,
      body: JSON.stringify({
        follower_id: args.followerId,
        following_id: args.followingId
      })
    })

    return response.success
  }

  static async delete (args: {
    followerId: number
    followingId: number
  }): Promise<boolean> {
    const response = await api.delete({
      endpoint: `followers`,
      body: JSON.stringify({
        follower_id: args.followerId,
        following_id: args.followingId
      })
    })

    return response.success
  }

  static async exists (args: {
    followerId: number
    followingId: number
  }): Promise<boolean> {
    const response = await api.get<boolean>({
      endpoint: `followers/exists`,
      body: JSON.stringify({
        follower_id: args.followerId,
        following_id: args.followingId
      })
    })

    return Boolean(response.value)
  }

  static async getIdsOfUser (args: { userId: number }): Promise<number[]> {
    const response = await api.get<number[]>({
      endpoint: `followers/all?userId=${args.userId}`
    })

    if (!response.value) return []
    
    return response.value
  }
}
