import { VIBE } from '../constants/VIBE'
import { Comment } from '../models/Comment'
import { CommentEndpoint } from '../models/CommentEndpoint'
import { getDate } from '../utilities/getDate'
import { LikeService } from './LikeService'
import { UserService } from './UserService'

export class CommentService {
  static getFromEndpoint (params: {
    commentEndpoint: CommentEndpoint
  }): Comment {
    const date = getDate(params.commentEndpoint.created_at)
    const user = UserService.getFromEndpoint({
      userEndpoint: params.commentEndpoint.user
    })

    return new Comment({
      user,
      likes: params.commentEndpoint.likes,
      id: params.commentEndpoint.id,
      date,
      postId: params.commentEndpoint.post_id,
      content: params.commentEndpoint.content
    })
  }

  static async getAllOfPost (params: {
    postId: number
    amount?: number
    page?: number
  }): Promise<Comment[]> {
    const response = await VIBE.get<CommentEndpoint[]>({
      endpoint: `comments/post/${params.postId}?amount=${
        params.amount ?? 6
      }&page=${params.page ?? 1}`
    })

    if (!response.value) return []

    const comments = await Promise.all(
      response.value.map(commentEndpoint =>
        this.getFromEndpoint({ commentEndpoint })
      )
    )

    return comments
  }

  static async getAmountOfPost (params: { postId: number }): Promise<number> {
    const response = await VIBE.get<number>({
      endpoint: `comments/post/amount/${params.postId}`
    })

    return response.value
  }

  static async create (params: {
    content: string
    postId: number
    userId: number
  }): Promise<Comment | null> {
    const response = await VIBE.post<CommentEndpoint>({
      endpoint: 'comments',
      body: JSON.stringify({
        content: params.content,
        post_id: params.postId
      })
    })

    if (response.error) return null

    const comment = this.getFromEndpoint({
      commentEndpoint: response.value!
    })

    return comment
  }

  static async delete (params: { commentId: number }): Promise<number> {
    const response = await VIBE.delete<number>({
      endpoint: `comments/${params.commentId}`
    })

    if (response.error) return -1

    const commentLikes = await LikeService.getAllOfComment({
      commentId: params.commentId
    })
    const likesIds = commentLikes.map(commentLike => commentLike.id)

    await Promise.all(likesIds.map(likeId => LikeService.delete({ likeId })))

    return response.value
  }

  static async getById (params: { commentId: number }): Promise<Comment | null> {
    const response = await VIBE.get<CommentEndpoint>({
      endpoint: `comments/${params.commentId}`
    })

    if (response.error) return null

    const comment = this.getFromEndpoint({
      commentEndpoint: response.value!
    })

    return comment
  }
}
