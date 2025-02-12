import { format } from '@formkit/tempo'
import { Like } from './Like'
import { api } from '../constants/SETTINGS'
import { LikeService } from '../services/LikeService'

export class Post {
  public id: number
  public userId: number
  public content: string
  public createdAt: string

  constructor ({
    id,
    userId,
    content,
    createdAt
  }: {
    id: number
    userId: number
    content: string
    createdAt: string
  }) {
    this.id = id
    this.userId = userId
    this.content = content
    this.createdAt = createdAt
  }

  public async delete (): Promise<boolean> {
    try {
      const url: string = `${api}/posts/id/${this.id}`
      const response: Response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting post:', error)
      return false
    }
  }

  public getDate (): string {
    try {
      const parsedDate: Date = new Date(this.createdAt.replace(' ', 'T'))
      const formattedDate: string = format(parsedDate, 'DD/MM/YYYY')
      return formattedDate
    } catch (error) {
      console.error('Error formatting date:', error)
      return ''
    }
  }

  public async getLikes (): Promise<Like[]> {
    try {
      const likes: Like[] = await LikeService.getAll()
      const postLikes: Like[] = likes.filter(like => like.postId === this.id)
      return postLikes
    } catch (error) {
      console.error('Error fetching likes for post:', error)
      return []
    }
  }
}
