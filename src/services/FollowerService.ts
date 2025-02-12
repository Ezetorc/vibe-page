import { getAdaptedFollower } from '../adapters/getAdaptedFollower'
import { api } from '../constants/SETTINGS'
import { Follower } from '../models/Follower'
import { FollowerEndpoint } from '../models/FollowerEndpoint'

export class FollowerService {
  static async create ({
    followerId,
    followingId
  }: {
    followerId: number,
    followingId: number
  }): Promise<boolean> {
    try {
      const url = `${api}/followers`
      const body = { follower_id: followerId, following_id: followingId }
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: "include"
      })

      return response.ok
    } catch (error) {
      console.error('Error creating follower:', error)
      return false
    }
  }

  static async delete ({
    followerId,
    followingId
  }: {
    followerId: number,
    followingId: number
  }): Promise<boolean> {
    try {
      const url = `${api}/followers`
      const body = { follower_id: followerId, following_id: followingId }
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: "include"
      })

      return response.ok
    } catch (error) {
      console.error('Error deleting follower:', error)
      return false
    }
  }

  static async exists ({
    followerId,
    followingId
  }: {
    followerId: number,
    followingId: number
  }): Promise<boolean> {
    try {
      const url: string = `${api}/followers`
      const response: Response = await fetch(url, {
        credentials: 'include'
      })

      if (!response.ok) {
        return false
      }

      const followerToCheck: Follower = new Follower({
        followerId,
        followingId
      })
      const followersEndpoint: FollowerEndpoint[] = await response.json()
      const followers: Follower[] = followersEndpoint.map(followerEndpoint =>
        getAdaptedFollower({followerEndpoint})
      )
      const followerExists: boolean = followers.some(follower => {
        return (
          follower.followerId === followerToCheck.followerId &&
          follower.followingId === followerToCheck.followingId
        )
      })

      return followerExists
    } catch (error) {
      console.error('Error checking follower existence:', error)
      return false
    }
  }

  static async getIdsOfUser ({
    userId
  }: {
    userId: number
  }): Promise<number[]> {
    try {
      const url: string = `${api}/followers/user/${userId}`
      const response: Response = await fetch(url, {
        credentials: 'include'
      })

      if (!response.ok) {
        return []
      }

      const followersIds: number[] = await response.json()
      return followersIds
    } catch (error) {
      console.error('Error fetching follower ids:', error)
      return []
    }
  }
}
