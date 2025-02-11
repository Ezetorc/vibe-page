import { getAdaptedLike } from '../adapters/getAdaptedLike'
import { api } from '../constants/SETTINGS'
import { Like } from '../models/Like'
import { LikeEndpoint } from '../models/LikeEndpoint'

export class LikeService {
  static async getAll (): Promise<Like[]> {
    const url: string = `${api}/likes`
    const response: Response = await fetch(url)
    const likesEndpoints: LikeEndpoint[] = await response.json()
    const likes: Like[] = likesEndpoints.map(likeEndpoint =>
      getAdaptedLike(likeEndpoint)
    )

    return likes
  }

  static async delete (likeId: number): Promise<boolean> {
    try {
      const url: string = `${api}/likes/id/${likeId}`
      const response: Response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  static async create (userId: number, postId: number): Promise<boolean> {
    const url: string = `${api}/likes`
    const body = {
      post_id: postId,
      user_id: userId
    }

    const response: Response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      return false
    }

    return true
  }
}
