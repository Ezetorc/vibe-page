import { Post } from './Post'
import { PostService } from '../services/PostService'
import { LikeService } from '../services/LikeService'
import { UserService } from '../services/UserService'
import { CommentService } from '../services/CommentService'
import { Comment } from './Comment'
import { Like } from './Like'
import { FollowService } from '../services/FollowService'

export class User {
  public id: number
  public name: string
  public email: string
  public password: string
  public imageId: string | null
  public imageUrl: string | null
  public description: string
  public date: string
  public postsAmount: number
  public followersAmount: number
  public followingAmount: number

  constructor (props: {
    id: number
    name: string
    email: string
    password: string
    imageId: string | null
    imageUrl: string | null
    description: string
    date: string
    postsAmount: number
    followersAmount: number
    followingAmount: number
  }) {
    this.id = props.id
    this.name = props.name
    this.email = props.email
    this.password = props.password
    this.imageId = props.imageId
    this.imageUrl = props.imageUrl
    this.description = props.description
    this.date = props.date
    this.postsAmount = props.postsAmount
    this.followersAmount = props.followersAmount
    this.followingAmount = props.followingAmount
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
      email: properties.email ?? this.email,
      password: properties.password ?? this.password,
      name: properties.name ?? this.name,
      imageId: properties.imageId ?? this.imageId,
      imageUrl: properties.imageUrl ?? this.imageUrl,
      description: properties.description ?? this.description,
      date: properties.date ?? this.date,
      postsAmount: properties.postsAmount ?? this.postsAmount,
      followersAmount: properties.followersAmount ?? this.followersAmount,
      followingAmount: properties.followingAmount ?? this.followingAmount
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
    if (this.imageId) {
      await UserService.deleteImage({ publicId: this.imageId })
    }

    await this.changeImageUrl({ newImageUrl: imageUrl })
    await this.changeImageId({ newImageId: publicId })
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
    newPassword: User['password']
  }): Promise<boolean> {
    return await UserService.update({
      body: { password: params.newPassword },
      onSuccess: updatedUser => (this.password = updatedUser.password)
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

  public async changeEmail (params: {
    newEmail: User['email']
  }): Promise<boolean> {
    return await UserService.update({
      body: { email: params.newEmail },
      onSuccess: updatedUser => (this.email = updatedUser.email)
    })
  }

  public async getPosts (params: {
    page?: number
    loggedUser: User | null
  }): Promise<Post[]> {
    const posts = await PostService.getAll({
      page: params.page ?? 1,
      userId: this.id,
      loggedUser: params.loggedUser
    })

    return posts
  }

  public async getFollowers (): Promise<User[]> {
    const followersIds = await FollowService.getIdsOfUser({
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
    loggedUser: User | null
  }): Promise<boolean> {
    const post = await PostService.getById({
      postId: params.postId,
      loggedUser: params.loggedUser
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

  public async dislikeComment (params: {
    commentId: number
    loggedUser: User | null
  }): Promise<boolean> {
    const post = await CommentService.getById({
      commentId: params.commentId,
      loggedUser: params.loggedUser
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
    loggedUser: User | null
  }): Promise<Post[]> {
    return await PostService.search({
      query: params.query,
      userId: this.id,
      page: params.page,
      loggedUser: params.loggedUser
    })
  }
}
