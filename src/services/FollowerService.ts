import { Data } from 'api-responser'
import { getAdaptedFollower } from '../adapters/getAdaptedFollower'
import { Follower } from '../models/Follower'
import { FollowerEndpoint } from '../models/FollowerEndpoint'
import { api } from '../constants/SETTINGS'

export class FollowerService {
  static async create ({
    followerId,
    followingId
  }: {
    followerId: number
    followingId: number
  }): Promise<Data<boolean>> {
    const response = await api.post({
      endpoint: `followers`,
      body: JSON.stringify({
        follower_id: followerId,
        following_id: followingId
      })
    })

    if (!response.value) return Data.failure()

    return Data.success(true)
  }

  static async delete ({
    followerId,
    followingId
  }: {
    followerId: number
    followingId: number
  }): Promise<Data<boolean>> {
    const response = await api.delete({
      endpoint: `followers`,
      body: JSON.stringify({
        follower_id: followerId,
        following_id: followingId
      })
    })

    if (!response.value) return Data.failure()

    return Data.success(true)
  }

  static async exists ({
    followerId,
    followingId
  }: {
    followerId: number
    followingId: number
  }): Promise<Data<boolean>> {
    const response = await api.get<FollowerEndpoint[]>({ endpoint: `followers` })

    if (!response.value) return Data.failure()

    const followers: Follower[] = response.value.map(followerEndpoint =>
      getAdaptedFollower({ followerEndpoint })
    )
    const followerExists: boolean = followers.some(follower => {
      return (
        follower.followerId === followerId &&
        follower.followingId === followingId
      )
    })

    return Data.success(followerExists)
  }

  static async getIdsOfUser ({
    userId
  }: {
    userId: number
  }): Promise<Data<number[]>> {
    const response = await api.get<number[]>({ endpoint: `followers/user/${userId}` })

    if (!response.value) return Data.failure()

    return Data.success(response.value)
  }
}
