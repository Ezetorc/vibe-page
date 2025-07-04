import { Post } from './Post'
import { PostService } from '../services/PostService'
import { LikeService } from '../services/LikeService'
import { UserService } from '../services/UserService'
import { CommentService } from '../services/CommentService'
import { Comment } from './Comment'
import { Like } from './Like'
import { FollowService } from '../services/FollowService'
import { NotificationService } from '../services/NotificationService'
import { Notification } from './Notification'

export class User {
  public id: number
  public name: string
  public imageId?: string
  public imageUrl?: string
  public description?: string
  public date?: string

  constructor (props: {
    id: number
    name: string
    imageId?: string
    imageUrl?: string
    description?: string
    date?: string
  }) {
    this.id = props.id
    this.name = props.name
    this.imageId = props.imageId
    this.imageUrl = props.imageUrl
    this.description = props.description
    this.date = props.date
  }

  public isOwnerOfPost (params: { post: Post }): boolean {
    return this.id === params.post.user.id
  }

  public isOwnerOfComment (params: { comment: Comment }): boolean {
    return this.id === params.comment.user.id
  }

  public update (properties: Partial<User>): User {
    return new User({
      id: properties.id ?? this.id,
      name: properties.name ?? this.name,
      imageId: properties.imageId ?? this.imageId,
      imageUrl: properties.imageUrl ?? this.imageUrl,
      description: properties.description ?? this.description,
      date: properties.date ?? this.date
    })
  }

  public async follow (params: { userId: User['id'] }): Promise<boolean> {
    const response = await FollowService.create({ followingId: params.userId })

    return response
  }

  public async unfollow (params: { userId: User['id'] }): Promise<boolean> {
    const response = await FollowService.delete({
      followingId: params.userId
    })

    return response
  }

  public async isFollowing (params: { userId: User['id'] }): Promise<boolean> {
    const following = await FollowService.exists({
      followerId: this.id,
      followingId: params.userId
    })

    return following
  }

  public async hasLikedPost (params: { postId: Post['id'] }): Promise<boolean> {
    return await UserService.hasLikedPost({
      userId: this.id,
      postId: params.postId
    })
  }

  public async hasLikedComment (params: {
    commentId: Comment['id']
  }): Promise<boolean> {
    return await UserService.hasLikedComment({
      userId: this.id,
      commentId: params.commentId
    })
  }

  public async saveImage (imageUrl: string | null, publicId: string | null) {
    if (!imageUrl || !publicId) return

    if (this.imageId) {
      await UserService.deleteImage({ publicId: this.imageId })
    }

    await this.changeImageUrl({ newImageUrl: imageUrl })
    await this.changeImageId({ newImageId: publicId })
  }

  public async clearNotifications (): Promise<boolean> {
    return await NotificationService.clearAllOfUser({ userId: this.id })
  }

  public async getNotifications (params: {
    page: number
  }): Promise<Notification[]> {
    return await NotificationService.getAll({
      page: params.page,
      senderId: this.id
    })
  }

  public async changeName (params: { newName: User['name'] }): Promise<boolean> {
    return await UserService.update({
      body: { name: params.newName },
      onSuccess: updatedUser => {
        this.name = updatedUser.name
      }
    })
  }

  public async changeImageUrl (params: {
    newImageUrl: User['imageUrl']
  }): Promise<boolean> {
    return await UserService.update({
      body: { image_url: params.newImageUrl },
      onSuccess: updatedUser => (this.imageUrl = updatedUser.imageUrl)
    })
  }

  public async changeImageId (params: {
    newImageId: User['imageId']
  }): Promise<boolean> {
    return await UserService.update({
      body: { image_id: params.newImageId },
      onSuccess: updatedUser => (this.imageId = updatedUser.imageId)
    })
  }

  public async changePassword (params: {
    newPassword: string
  }): Promise<boolean> {
    return await UserService.update({
      body: { password: params.newPassword }
    })
  }

  public async changeDescription (params: {
    newDescription: User['description']
  }): Promise<boolean> {
    return await UserService.update({
      body: { description: params.newDescription },
      onSuccess: updatedUser => (this.description = updatedUser.description)
    })
  }

  public async changeEmail (params: { newEmail: string }): Promise<boolean> {
    return await UserService.update({
      body: { email: params.newEmail }
    })
  }

  public async delete (): Promise<number> {
    return await UserService.delete({
      userId: this.id,
      imageId: this.imageId
    })
  }

  public async getPosts (params: { page?: number }): Promise<Post[]> {
    const posts = await PostService.getAll({
      page: params.page ?? 1,
      userId: this.id
    })

    return posts
  }

  public async likePost (params: {
    postId: number
    signal?: AbortSignal
  }): Promise<Like | null> {
    const response = await LikeService.create({
      userId: this.id,
      targetId: params.postId,
      type: 'post',
      signal: params.signal
    })

    return response
  }

  public async dislikePost (params: {
    postId: number
    signal?: AbortSignal
  }): Promise<boolean> {
    const post = await PostService.getById({
      postId: params.postId
    })

    if (!post) return false

    const postLikes = await post.getLikes()

    if (!postLikes) return false

    const likeToDelete = postLikes.find(like => like.userId === this.id)

    if (!likeToDelete) return false

    const deleteSuccessful = await LikeService.delete({
      likeId: likeToDelete.id,
      signal: params.signal
    })

    return deleteSuccessful
  }

  public async likeComment (params: {
    commentId: number
  }): Promise<Like | null> {
    const response = await LikeService.create({
      userId: this.id,
      targetId: params.commentId,
      type: 'comment'
    })

    return response
  }

  public async dislikeComment (params: { commentId: number }): Promise<boolean> {
    const post = await CommentService.getById({
      commentId: params.commentId
    })

    if (!post) return false

    const postLikes = await post.getLikes()
    const likeToDelete = postLikes.find(like => like.userId === this.id)

    if (!likeToDelete) return false

    const deleteSuccessful = await LikeService.delete({
      likeId: likeToDelete.id
    })

    return deleteSuccessful
  }

  public async searchPosts (params: {
    query: string
    page: number
  }): Promise<Post[]> {
    return await PostService.search({
      query: params.query,
      userId: this.id,
      page: params.page
    })
  }
}
