import { format } from '@formkit/tempo'
import { Post } from './Post'
import { FollowerService } from '../services/FollowerService'
import { PostService } from '../services/PostService'
import { LikeService } from '../services/LikeService'
import { UserService } from '../services/UserService'
import { Data } from './Data'
import { fetchAPI } from '../utilities/fetchAPI'
import { CommentService } from '../services/CommentService'
import { Comment } from './Comment'

export class User {
  public id: number
  public name: string
  public email: string
  public password: string
  public profileImageId: string | null
  public description: string
  public createdAt: string

  constructor ({
    id,
    name,
    email,
    password,
    profileImageId,
    description,
    createdAt
  }: {
    id: number
    name: string
    email: string
    password: string
    profileImageId: string | null
    description: string
    createdAt: string
  }) {
    this.id = id
    this.name = name
    this.email = email
    this.password = password
    this.profileImageId = profileImageId
    this.description = description
    this.createdAt = createdAt
  }

  public isOwnerOfPost({ post }: { post: Post }) {
    return this.id === post.userId
  }

  public isOwnerOfComment ({ comment }: { comment: Comment }) {
    return this.id === comment.userId
  }

  public async follow ({ userId }: { userId: number }): Promise<Data<boolean>> {
    const response = await FollowerService.create({
      followerId: this.id,
      followingId: userId
    })

    return response
  }

  public async unfollow ({
    userId
  }: {
    userId: number
  }): Promise<Data<boolean>> {
    const response = await FollowerService.delete({
      followerId: this.id,
      followingId: userId
    })

    return response
  }

  public async isFollowing ({
    userId
  }: {
    userId: number
  }): Promise<Data<boolean>> {
    const following = await FollowerService.exists({
      followerId: this.id,
      followingId: userId
    })

    return following
  }

  

  public async hasLikedPost ({
    postId
  }: {
    postId: number
  }): Promise<Data<boolean>> {
    const post = await PostService.getById({ postId })

    if (!post.value) return Data.failure()

    const postLikes = await post.value.getLikes()

    if (!postLikes.value) return Data.failure()

    const hasLiked: boolean = postLikes.value.some(
      like => like.userId === this.id
    )

    return Data.success(hasLiked)
  }

  public async hasLikedComment ({
    commentId
  }: {
    commentId: number
  }): Promise<Data<boolean>> {
    const comment = await CommentService.getById({ commentId })

    if (!comment.value) return Data.failure()

    const commentLikes = await comment.value.getLikes()

    if (!commentLikes.value) return Data.failure()

    const hasLiked: boolean = commentLikes.value.some(
      like => like.userId === this.id
    )

    return Data.success(hasLiked)
  }

  public getDate (): string {
    const parsedDate: Date = new Date(this.createdAt.replace(' ', 'T'))
    const formattedDate: string = format(parsedDate, 'DD/MM/YYYY')

    return formattedDate
  }

  public async changeName ({
    newName
  }: {
    newName: string
  }): Promise<Data<boolean>> {
    const response = await fetchAPI({
      url: `/users/id/${this.id}`,
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newName })
    })

    if (!response.value) return Data.failure()

    this.name = newName
    return Data.success(true)
  }

  public async changePassword ({
    newPassword
  }: {
    newPassword: string
  }): Promise<Data<boolean>> {
    const response = await fetchAPI({
      url: `/users/id/${this.id}`,
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: newPassword })
    })

    if (!response.value) return Data.failure()

    this.password = newPassword
    return Data.success(true)
  }

  public async changeDescription ({
    newDescription
  }: {
    newDescription: string
  }): Promise<Data<boolean>> {
    const response = await fetchAPI({
      url: `/users/id/${this.id}`,
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description: newDescription })
    })

    if (!response.value) return Data.failure()

    this.description = newDescription
    return Data.success(true)
  }

  public async getPosts (): Promise<Data<Post[]>> {
    const posts = await PostService.getAll()

    if (!posts.value) return Data.failure()

    const userPosts: Post[] = posts.value.filter(
      post => post.userId === this.id
    )

    return Data.success(userPosts)
  }

  public async changeEmail ({
    newEmail
  }: {
    newEmail: string
  }): Promise<Data<boolean>> {
    const response = await fetchAPI({
      url: `/users/id/${this.id}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: newEmail })
    })

    if (!response.value) return Data.failure()

    this.email = newEmail
    return Data.success(true)
  }

  public async likePost ({
    postId
  }: {
    postId: number
  }): Promise<Data<boolean>> {
    const response = await LikeService.create({
      userId: this.id,
      targetId: postId,
      type: 'post'
    })

    return response
  }

  public async getFollowers (): Promise<Data<(User | null)[]>> {
    const followersIds = await FollowerService.getIdsOfUser({
      userId: this.id
    })

    if (!followersIds.value) return Data.failure()

    const followers = await Promise.all(
      followersIds.value.map(followerId =>
        UserService.getById({ userId: followerId }).then(
          response => response.value
        )
      )
    )

    return Data.success(followers)
  }

  public async unlikePost ({
    postId
  }: {
    postId: number
  }): Promise<Data<boolean>> {
    const post = await PostService.getById({ postId })

    if (!post.value) return Data.failure()

    const postLikes = await post.value.getLikes()

    if (!postLikes.value) return Data.failure()

    const likeToDelete = postLikes.value.find(like => like.userId === this.id)

    if (!likeToDelete) return Data.failure()

    const deleteSuccessful = await LikeService.delete({
      likeId: likeToDelete.id
    })

    return deleteSuccessful
  }

  public async likeComment ({
    commentId
  }: {
    commentId: number
  }): Promise<Data<boolean>> {
    const response = await LikeService.create({
      userId: this.id,
      targetId: commentId,
      type: 'comment'
    })

    return response
  }

  public async unlikeComment ({
    commentId
  }: {
    commentId: number
  }): Promise<Data<boolean>> {
    const post = await CommentService.getById({ commentId })

    if (!post.value) return Data.failure()

    const postLikes = await post.value.getLikes()

    if (!postLikes.value) return Data.failure()

    const likeToDelete = postLikes.value.find(like => like.userId === this.id)

    if (!likeToDelete) return Data.failure()

    const deleteSuccessful = await LikeService.delete({
      likeId: likeToDelete.id
    })

    return deleteSuccessful
  }
}
