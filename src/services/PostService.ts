import { Post } from '../models/Post'
import { PostEndpoint } from '../models/PostEndpoint'
import { LikeService } from './LikeService'
import { VIBE } from '../constants/VIBE'
import { User } from '../models/User'
import { getDate } from '../utilities/getDate'
import { UserService } from './UserService'
import { CommentService } from './CommentService'

export class PostService {
  static async getFromEndpoint (params: {
    postEndpoint: PostEndpoint
    loggedUser: User | null
  }): Promise<Post> {
    const date = getDate(params.postEndpoint.created_at)
    const [user, likes, commentsAmount, userLiked] = await Promise.all([
      UserService.getById({ userId: params.postEndpoint.user_id }),
      LikeService.getAmountOfPost({ postId: params.postEndpoint.id }),
      CommentService.getAmountOfPost({ postId: params.postEndpoint.id }),
      params.loggedUser?.hasLikedPost({ postId: params.postEndpoint.id })
    ])

    return new Post({
      id: params.postEndpoint.id,
      content: params.postEndpoint.content,
      user: user!,
      date,
      likes,
      comments: commentsAmount,
      userLiked: Boolean(userLiked)
    })
  }

  static async create (params: {
    userId: number
    content: string
    loggedUser: User | null
  }): Promise<Post | null> {
    const response = await VIBE.post<PostEndpoint>({
      endpoint: 'posts',
      body: JSON.stringify({ content: params.content })
    })

    if (response.error) return null

    const post = this.getFromEndpoint({
      postEndpoint: response.value!,
      loggedUser: params.loggedUser
    })

    return post
  }

  static async delete (params: { postId: number }): Promise<number> {
    const response = await VIBE.delete<boolean>({
      endpoint: `posts/${params.postId}`
    })

    if (response.error) return -1

    const postLikes = await LikeService.getAllOfPost({ postId: params.postId })

    if (!postLikes) return -1

    const likesIds = postLikes.map(postLike => postLike.id)

    await Promise.all(likesIds.map(likeId => LikeService.delete({ likeId })))

    return params.postId
  }

  static async getAll (params: {
    loggedUser: User | null
    amount?: number
    page?: number
    userId?: number
  }): Promise<Post[]> {
    const endpoint = params.userId
      ? `posts/?amount=${params.amount ?? 6}&page=${params.page ?? 1}&userId=${
          params.userId
        }`
      : `posts/?amount=${params.amount ?? 6}&page=${params.page ?? 1}`
    const response = await VIBE.get<PostEndpoint[]>({ endpoint })

    if (!response.value) return []

    const posts = await Promise.all(
      response.value.map(postEndpoint =>
        this.getFromEndpoint({ postEndpoint, loggedUser: params.loggedUser })
      )
    )

    return posts
  }

  static async getAmountOfUser (params: { userId: number }): Promise<number> {
    const response = await VIBE.get<number>({
      endpoint: `posts/count?userId=${params.userId}`
    })

    if (!response.error) {
      return response.value!
    } else {
      return -1
    }
  }

  static async getById (params: {
    postId: number
    loggedUser: User | null
  }): Promise<Post | null> {
    const response = await VIBE.get<PostEndpoint>({
      endpoint: `posts/${params.postId}`
    })

    if (response.error) return null

    const post = await this.getFromEndpoint({
      postEndpoint: response.value!,
      loggedUser: params.loggedUser
    })

    return post
  }

  static async search (params: {
    query: string
    loggedUser: User | null
    userId?: number
    amount?: number
    page?: number
  }): Promise<Post[]> {
    const endpoint = params.userId
      ? `posts/search/${params.query}?userId=${params.userId}&amount=${
          params.amount ?? 6
        }&page=${params.page ?? 1}`
      : `posts/search/${params.query}?amount=${params.amount ?? 6}&page=${
          params.page ?? 1
        }`
    const response = await VIBE.get<PostEndpoint[]>({ endpoint })

    if (response.error) return []

    const posts = await Promise.all(
      response.value.map(postEndpoint =>
        this.getFromEndpoint({ postEndpoint, loggedUser: params.loggedUser })
      )
    )

    return posts
  }
}
