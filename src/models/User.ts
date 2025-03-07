import { format } from '@formkit/tempo'
import { Post } from './Post'
import { FollowerService } from '../services/FollowerService'
import { PostService } from '../services/PostService'
import { LikeService } from '../services/LikeService'
import { UserService } from '../services/UserService'
import { CommentService } from '../services/CommentService'
import { Comment } from './Comment'
import { api } from '../constants/SETTINGS'
import { PostEndpoint } from './PostEndpoint'
import { getAdaptedPost } from '../adapters/getAdaptedPost'
import { Like } from './Like'
import { UserEndpoint } from './UserEndpoint'
import { getAdaptedUser } from '../adapters/getAdaptedUser'

export class User {
  public id: number
  public name: string
  public email: string
  public password: string
  public imageId: string | null
  public imageUrl: string | null
  public description: string
  public createdAt: string

  constructor ({
    id,
    name,
    email,
    password,
    imageUrl,
    imageId,
    description,
    createdAt
  }: {
    id: number
    name: string
    email: string
    password: string
    imageId: string | null
    imageUrl: string | null
    description: string
    createdAt: string
  }) {
    this.id = id
    this.name = name
    this.email = email
    this.password = password
    this.imageId = imageId
    this.imageUrl = imageUrl
    this.description = description
    this.createdAt = createdAt
  }

  public isOwnerOfPost (args: { postUserId: number }): boolean {
    return this.id === args.postUserId
  }

  public isOwnerOfComment (args: { comment: Comment }): boolean {
    return this.id === args.comment.userId
  }

  public async follow (args: { userId: number }): Promise<boolean> {
    const response = await FollowerService.create({
      followerId: this.id,
      followingId: args.userId
    })

    return response
  }

  public async unfollow (args: { userId: number }): Promise<boolean> {
    const response = await FollowerService.delete({
      followerId: this.id,
      followingId: args.userId
    })

    return response
  }

  public async isFollowing (args: { userId: number }): Promise<boolean> {
    const following = await FollowerService.exists({
      followerId: this.id,
      followingId: args.userId
    })

    return following
  }

  public async hasLikedPost (args: { postId: number }): Promise<boolean> {
    const response = await api.get<boolean>({
      endpoint: `users/liked?type=post&userId=${this.id}&targetId=${args.postId}`
    })

    return Boolean(response.value)
  }

  public async hasLikedComment (args: { commentId: number }): Promise<boolean> {
    const response = await api.get<boolean>({
      endpoint: `users/liked?type=comment&userId=${this.id}&targetId=${args.commentId}`
    })

    return Boolean(response.value)
  }

  public getDate (): string {
    const parsedDate: Date = new Date(this.createdAt.replace(' ', 'T'))
    const formattedDate: string = format(parsedDate, 'DD/MM/YYYY')

    return formattedDate
  }

  public async changeName (args: { newName: string }): Promise<boolean> {
    const response = await api.patch<UserEndpoint>({
      endpoint: `users?id=${this.id}`,
      body: JSON.stringify({ name: args.newName })
    })

    if (!response.success) return false

    const newUser = getAdaptedUser({ userEndpoint: response.value! })

    if (response.success) {
      this.name = newUser.name
      return true
    } else {
      return false
    }
  }

  public async changeImageUrl (args: { newImageUrl: string }): Promise<boolean> {
    const response = await api.patch<UserEndpoint>({
      endpoint: `users?id=${this.id}`,
      body: JSON.stringify({ image_url: args.newImageUrl })
    })

    if (!response.success) return false

    const newUser = getAdaptedUser({ userEndpoint: response.value! })

    if (response.success) {
      this.imageUrl = newUser.imageUrl
      return true
    } else {
      return false
    }
  }

  public async changeImageId (args: { newImageId: string }): Promise<boolean> {
    const response = await api.patch<UserEndpoint>({
      endpoint: `users?id=${this.id}`,
      body: JSON.stringify({ image_id: args.newImageId })
    })

    if (!response.success) return false

    const newUser = getAdaptedUser({ userEndpoint: response.value! })

    if (response.success) {
      this.imageId = newUser.imageId
      return true
    } else {
      return false
    }
  }

  public async changePassword (args: { newPassword: string }): Promise<boolean> {
    const response = await api.patch<UserEndpoint>({
      endpoint: `users?id=${this.id}`,
      body: JSON.stringify({ password: args.newPassword })
    })

    if (!response.success) return false

    const newUser = getAdaptedUser({ userEndpoint: response.value! })

    if (response.success) {
      this.password = newUser.password
      return true
    } else {
      return false
    }
  }

  public async changeDescription (args: {
    newDescription: string
  }): Promise<boolean> {
    const response = await api.patch<UserEndpoint>({
      endpoint: `users?id=${this.id}`,
      body: JSON.stringify({ description: args.newDescription })
    })

    if (!response.success) return false

    const newUser = getAdaptedUser({ userEndpoint: response.value! })

    if (response.success) {
      this.description = newUser.description
      return true
    } else {
      return false
    }
  }

  public async changeEmail (args: { newEmail: string }): Promise<boolean> {
    const response = await api.patch<UserEndpoint>({
      endpoint: `users?id=${this.id}`,
      body: JSON.stringify({ email: args.newEmail })
    })

    if (!response.success) return false

    const newUser = getAdaptedUser({ userEndpoint: response.value! })

    if (response.success) {
      this.email = newUser.email
      return true
    } else {
      return false
    }
  }

  public async getPosts (args: { page?: number } = {}): Promise<Post[]> {
    const posts = await PostService.getAll({ page: args.page ?? 1 })

    if (!posts) return []

    const userPosts: Post[] = posts.filter(post => post.userId === this.id)

    return userPosts
  }

  public async getFollowers (): Promise<User[]> {
    const followersIds = await FollowerService.getIdsOfUser({
      userId: this.id
    })

    if (!followersIds) return []

    const followers = await Promise.all(
      followersIds.map(followerId =>
        UserService.getById({ userId: followerId })
      )
    )
    const userFollowers = followers.filter(follower => follower !== null)

    return userFollowers
  }

  public async likePost (args: { postId: number }): Promise<Like | null> {
    const response = await LikeService.create({
      userId: this.id,
      targetId: args.postId,
      type: 'post'
    })

    return response
  }

  public async dislikePost (args: { postId: number }): Promise<boolean> {
    const post = await PostService.getById({ postId: args.postId })

    if (!post) return false

    const postLikes = await post.getLikes()

    if (!postLikes) return false

    const likeToDelete = postLikes.find(like => like.userId === this.id)

    if (!likeToDelete) return false

    const deleteSuccessful = await LikeService.delete({
      likeId: likeToDelete.id
    })

    return deleteSuccessful
  }

  public async likeComment (args: { commentId: number }): Promise<Like | null> {
    const response = await LikeService.create({
      userId: this.id,
      targetId: args.commentId,
      type: 'comment'
    })

    return response
  }

  public async dislikeComment (args: { commentId: number }): Promise<boolean> {
    const post = await CommentService.getById({ commentId: args.commentId })

    if (!post) return false

    const postLikes = await post.getLikes()
    const likeToDelete = postLikes.find(like => like.userId === this.id)

    if (!likeToDelete) return false

    const deleteSuccessful = await LikeService.delete({
      likeId: likeToDelete.id
    })

    return deleteSuccessful
  }

  public async searchPosts (args: { query: string }): Promise<Post[]> {
    const response = await api.get<PostEndpoint[]>({
      endpoint: `posts/search?query=${encodeURIComponent(args.query)}&userId=${
        this.id
      }`
    })

    if (!response.value) return []

    const posts = response.value.map(postEndpoint =>
      getAdaptedPost({ postEndpoint })
    )

    return posts
  }
}
