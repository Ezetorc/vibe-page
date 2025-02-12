import { getAdaptedFollower } from '../adapters/getAdaptedFollower'
import { api } from '../constants/SETTINGS'
import { Data } from '../models/Data'
import { Follower } from '../models/Follower'
import { FollowerEndpoint } from '../models/FollowerEndpoint'
import { fetchAPI } from '../utilities/fetchAPI'

export class FollowerService {
  static async create ({
    followerId,
    followingId
  }: {
    followerId: number
    followingId: number
  }): Promise<Data<boolean>> {
    const response = await fetchAPI({
      url: `/followers`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const response = await fetchAPI({
      url: `${api}/followers`,
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
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
    const response = await fetchAPI<FollowerEndpoint[]>({
      url: `/followers`
    })

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
    const response = await fetchAPI<number[]>({
      url: `/followers/user/${userId}`
    })

    if (!response.value) return Data.failure()

    return Data.success(response.value)
  }
}
