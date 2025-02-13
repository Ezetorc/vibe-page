import { format } from '@formkit/tempo'
import { Like } from './Like'
import { LikeService } from '../services/LikeService'
import { Data } from './Data'
import { fetchAPI } from '../utilities/fetchAPI'

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

  public async delete (): Promise<Data<boolean>> {
    const response = await fetchAPI<boolean>({
      url: `/posts/id/${this.id}`,
      method: 'DELETE'
    })

    return response
  }

  public getDate (): string {
    const parsedDate: Date = new Date(this.createdAt.replace(' ', 'T'))
    const formattedDate: string = format(parsedDate, 'DD/MM/YYYY')
    
    return formattedDate
  }

  public async getLikes (): Promise<Data<Like[]>> {
    const likes = await LikeService.getAll()

    if (!likes.value) return Data.failure()

    const postLikes = likes.value.filter(like => like.postId === this.id)

    return Data.success(postLikes)
  }
}
