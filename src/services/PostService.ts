import { getAdaptedPost } from '../adapters/getAdaptedPost'
import { Post } from '../models/Post'
import { PostEndpoint } from '../models/PostEndpoint'
import { api } from '../constants/SETTINGS'
import { LikeService } from './LikeService'

export class PostService {
  static async create (args: {
    userId: number
    content: string
  }): Promise<Post | null> {
    const response = await api.post<PostEndpoint>({
      endpoint: 'posts',
      body: JSON.stringify({ user_id: args.userId, content: args.content })
    })

    if (!response.success) return null

    const post = getAdaptedPost({ postEndpoint: response.value! })

    return post
  }

  static async delete (args: { postId: number }): Promise<number> {
    const response = await api.delete<boolean>({
      endpoint: `posts/id?id=${args.postId}`
    })

    if (!response.success) return -1

    const postLikes = await LikeService.getAllOfPost({ postId: args.postId })

    if (!postLikes) return -1

    const likesIds = postLikes.map(postLike => postLike.id)

    await Promise.all(likesIds.map(likeId => LikeService.delete({ likeId })))

    return args.postId
  }

  static async getAll (
    args: {
      amount?: number
      page?: number
      userId?: number
    } = {}
  ): Promise<Post[]> {
    const endpoint = args.userId
      ? `posts/all?amount=${args.amount ?? 6}&page=${args.page ?? 1}&userId=${
          args.userId
        }`
      : `posts/all?amount=${args.amount ?? 6}&page=${args.page ?? 1}`
    const response = await api.get<PostEndpoint[]>({ endpoint })

    if (!response.value) return []

    const posts = response.value.map(postEndpoint =>
      getAdaptedPost({ postEndpoint })
    )

    return posts
  }

  static async getById (args: { postId: number }): Promise<Post | null> {
    const response = await api.get<PostEndpoint>({
      endpoint: `posts/id?id=${args.postId}`
    })

    if (!response.success) return null

    const post = getAdaptedPost({ postEndpoint: response.value! })

    return post
  }

  static async search (args: { query: string }): Promise<Post[]> {
    const response = await api.get<PostEndpoint[]>({
      endpoint: `posts/search?query=${args.query}`
    })

    if (!response.success) return []

    const posts = response.value!.map(postEndpoint =>
      getAdaptedPost({ postEndpoint })
    )

    return posts
  }
}
