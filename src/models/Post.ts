import { format } from '@formkit/tempo'
import { getAdaptedLike } from '../adapters/getAdaptedLike'
import { getAdaptedPost } from '../adapters/getAdaptedPost'
import { Like } from './Like'
import { LikeEndpoint } from './LikeEndpoint'
import { PostEndpoint } from './PostEndpoint'
import { api } from '../constants/SETTINGS'

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
    } catch {
      return false
    }
  }

  public getDate (): string {
    const parsedDate: Date = new Date(this.createdAt.replace(' ', 'T'))
    const formattedDate: string = format(parsedDate, 'DD/MM/YYYY')

    return formattedDate
  }

  static async create (userId: number, content: string): Promise<boolean> {
    try {
      const url: string = `${api}/posts`
      const body = {
        user_id: userId,
        content: content
      }
      const response: Response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  public async getLikes (): Promise<Like[]> {
    const url: string = `${api}/likes`
    const response: Response = await fetch(url)
    const likesEndpoints: LikeEndpoint[] = await response.json()
    const likes: Like[] = likesEndpoints.map(likeEndpoint =>
      getAdaptedLike(likeEndpoint)
    )
    const postLikes: Like[] = likes.filter(like => like.postId === this.id)

    return postLikes
  }

  static async getAll (): Promise<Post[]> {
    const url: string = `${api}/posts`
    const response: Response = await fetch(url, {
      method: 'GET',
      credentials: 'include'
    })
    const postsEndpoints: PostEndpoint[] = await response.json()
    const posts: Post[] = postsEndpoints.map((postEndpoint: PostEndpoint) =>
      getAdaptedPost(postEndpoint)
    )

    return posts
  }

  static async getById (postId: number): Promise<Post> {
    const url: string = `${api}/posts/id/${postId}`
    const response: Response = await fetch(url, {
      method: 'GET',
      credentials: 'include'
    })
    const postEndpoint: PostEndpoint = await response.json()
    const post: Post = getAdaptedPost(postEndpoint)

    return post
  }

  static async search (query: string): Promise<Post[]> {
    const url: string = `${api}/posts/search/${encodeURIComponent(query)}`
    const response = await fetch(url)
    const postsEndpoints: PostEndpoint[] = await response.json()
    const posts: Post[] = postsEndpoints.map(postEndpoint =>
      getAdaptedPost(postEndpoint)
    )

    return posts
  }
}
