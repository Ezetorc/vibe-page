import { getAdaptedLike } from '../adapters/getAdaptedLike'
import { getAdaptedPost } from '../adapters/getAdaptedPost'
import { api } from '../constants/api'
import { Like } from './Like'
import { LikeEndpoint } from './LikeEndpoint'
import { PostEndpoint } from './PostEndpoint'

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
    const response: Response = await fetch(url)
    const postsEndpoints: PostEndpoint[] = await response.json()
    const posts: Post[] = postsEndpoints.map((postEndpoint: PostEndpoint) =>
      getAdaptedPost(postEndpoint)
    )

    return posts
  }

  static async getById (postId: number): Promise<Post> {
    const url: string = `${api}/posts/${postId}`
    const response: Response = await fetch(url)
    const postEndpoint: PostEndpoint = await response.json()
    const post: Post = getAdaptedPost(postEndpoint)

    return post
  }
}
