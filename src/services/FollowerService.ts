import { getAdaptedFollower } from '../adapters/getAdaptedFollower'
import { api } from '../constants/SETTINGS'
import { Follower } from '../models/Follower'
import { FollowerEndpoint } from '../models/FollowerEndpoint'

export class FollowerService {
  static async create (
    followerId: number,
    followingId: number
  ): Promise<boolean> {
    try {
      const url = `${api}/followers`
      const body = { follower_id: followerId, following_id: followingId }
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      return response.ok
    } catch {
      return false
    }
  }

  static async delete (
    followerId: number,
    followingId: number
  ): Promise<boolean> {
    try {
      const url = `${api}/followers`
      const body = { follower_id: followerId, following_id: followingId }
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      return response.ok
    } catch {
      return false
    }
  }

  static async exists (followerId: number, followingId: number) {
    try {
      const url: string = `${api}/followers`
      const response: Response = await fetch(url)

      if (!response.ok) {
        return false
      }

      const followerToCheck: Follower = new Follower({
        followerId,
        followingId
      })
      const followersEndpoint: FollowerEndpoint[] = await response.json()
      const followers: Follower[] = followersEndpoint.map(followerEndpoint =>
        getAdaptedFollower(followerEndpoint)
      )
      const followerExists: boolean = followers.some(follower => {
        return (
          follower.followerId === followerToCheck.followerId &&
          follower.followingId === followerToCheck.followingId
        )
      })

      return followerExists
    } catch {
      return false
    }
  }

  static async getIdsOfUser (userId: number): Promise<number[]> {
    const url: string = `${api}/followers/user/${userId}`
    const response: Response = await fetch(url)
    const followersIds: number[] = await response.json()

    return followersIds
  }
}
