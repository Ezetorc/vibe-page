import { format } from '@formkit/tempo'
import { Like } from './Like'
import { Post } from './Post'
import { api } from '../constants/SETTINGS'
import { FollowerService } from '../services/FollowerService'
import { PostService } from '../services/PostService'
import { LikeService } from '../services/LikeService'
import { UserService } from '../services/UserService'

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

  public isOwnerOf (post: Post) {
    return this.id === post.userId
  }

  public async follow (userId: number): Promise<void> {
    await FollowerService.create(this.id, userId)
  }

  public async unfollow (userId: number): Promise<void> {
    await FollowerService.delete(this.id, userId)
  }

  public async isFollowing (userId: number): Promise<boolean> {
    const following: boolean = await FollowerService.exists(this.id, userId)

    return following
  }

  public async hasLikedPost (postId: number): Promise<boolean> {
    const post: Post = await PostService.getById(postId)
    const postLikes: Like[] = await post.getLikes()
    const userLike: Like | undefined = postLikes.find(
      like => like.userId === this.id
    )

    return Boolean(userLike)
  }

  public getDate (): string {
    const parsedDate: Date = new Date(this.createdAt.replace(' ', 'T'))
    const formattedDate: string = format(parsedDate, 'DD/MM/YYYY')

    return formattedDate
  }

  public async changeName (newName: string): Promise<boolean> {
    const url: string = `${api}/users/id/${this.id}`
    const body = {
      name: newName
    }

    const response: Response = await fetch(url, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      return false
    }

    this.name = newName
    return true
  }

  public async changeDescription (newDescription: string): Promise<boolean> {
    const url: string = `${api}/users/id/${this.id}`
    const body = {
      description: newDescription
    }

    const response: Response = await fetch(url, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      return false
    }

    this.description = newDescription
    return true
  }

  public async getPosts (): Promise<Post[]> {
    const posts: Post[] = await PostService.getAll()
    const userPosts: Post[] = posts.filter(post => post.userId === this.id)

    return userPosts
  }

  public async changeEmail (newEmail: string): Promise<boolean> {
    const url: string = `${api}/users/id/${this.id}`
    const body = {
      email: newEmail
    }

    const response: Response = await fetch(url, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      return false
    }

    this.email = newEmail
    return true
  }

  public async likePost (postId: number): Promise<boolean> {
    try {
      await LikeService.create(this.id, postId)
      return true
    } catch {
      return false
    }
  }

  public async getFollowers (): Promise<User[]> {
    const followersIds: number[] = await FollowerService.getIdsOfUser(this.id)
    const followers: User[] = await Promise.all(
      followersIds.map(followerId => UserService.getById(followerId))
    )

    return followers
  }

  public async unlikePost (postId: number): Promise<boolean> {
    try {
      const post: Post = await PostService.getById(postId)
      const postLikes: Like[] = await post.getLikes()
      const likeToDelete: Like | undefined = postLikes.find(
        like => like.userId === this.id
      )

      if (!likeToDelete) {
        return false
      }

      const deleteSuccessful: boolean = await LikeService.delete(
        likeToDelete.id
      )

      return deleteSuccessful
    } catch {
      return false
    }
  }
}
