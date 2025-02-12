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

  public isOwnerOf ({ post }: { post: Post }) {
    return this.id === post.userId
  }

  public async follow ({ userId }: { userId: number }): Promise<void> {
    try {
      await FollowerService.create({ followerId: this.id, followingId: userId })
    } catch (error) {
      console.error('Error following user:', error)
    }
  }

  public async unfollow ({ userId }: { userId: number }): Promise<void> {
    try {
      await FollowerService.delete({ followerId: this.id, followingId: userId })
    } catch (error) {
      console.error('Error unfollowing user:', error)
    }
  }

  public async isFollowing ({ userId }: { userId: number }): Promise<boolean> {
    try {
      const following: boolean = await FollowerService.exists({
        followerId: this.id,
        followingId: userId
      })
      return following
    } catch (error) {
      console.error('Error checking follow status:', error)
      return false
    }
  }

  public async hasLikedPost ({ postId }: { postId: number }): Promise<boolean> {
    try {
      const post: Post | null = await PostService.getById({ postId })
      if (!post) return false

      const postLikes: Like[] = await post.getLikes()
      const userLike: Like | undefined = postLikes.find(
        like => like.userId === this.id
      )

      return Boolean(userLike)
    } catch (error) {
      console.error('Error checking if user has liked post:', error)
      return false
    }
  }

  public getDate (): string {
    const parsedDate: Date = new Date(this.createdAt.replace(' ', 'T'))
    const formattedDate: string = format(parsedDate, 'DD/MM/YYYY')

    return formattedDate
  }

  public async changeName ({ newName }: { newName: string }): Promise<boolean> {
    try {
      const url: string = `${api}/users/id/${this.id}`
      const body = { name: newName }

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
    } catch (error) {
      console.error('Error changing name:', error)
      return false
    }
  }

  public async changeDescription ({
    newDescription
  }: {
    newDescription: string
  }): Promise<boolean> {
    try {
      const url: string = `${api}/users/id/${this.id}`
      const body = { description: newDescription }

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
    } catch (error) {
      console.error('Error changing description:', error)
      return false
    }
  }

  public async getPosts (): Promise<Post[]> {
    try {
      const posts: Post[] = await PostService.getAll()
      const userPosts: Post[] = posts.filter(post => post.userId === this.id)

      return userPosts
    } catch (error) {
      console.error('Error fetching posts:', error)
      return []
    }
  }

  public async changeEmail ({
    newEmail
  }: {
    newEmail: string
  }): Promise<boolean> {
    try {
      const url: string = `${api}/users/id/${this.id}`
      const body = { email: newEmail }

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
    } catch (error) {
      console.error('Error changing email:', error)
      return false
    }
  }

  public async likePost ({ postId }: { postId: number }): Promise<boolean> {
    try {
      await LikeService.create({ userId: this.id, postId })
      return true
    } catch (error) {
      console.error('Error liking post:', error)
      return false
    }
  }

  public async getFollowers (): Promise<(User | null)[]> {
    try {
      const followersIds: number[] = await FollowerService.getIdsOfUser({
        userId: this.id
      })
      const followers: (User | null)[] = await Promise.all(
        followersIds.map(followerId =>
          UserService.getById({ userId: followerId })
        )
      )

      return followers
    } catch (error) {
      console.error('Error fetching followers:', error)
      return []
    }
  }

  public async unlikePost ({ postId }: { postId: number }): Promise<boolean> {
    try {
      const post: Post | null = await PostService.getById({ postId })
      if (!post) return false

      const postLikes: Like[] = await post.getLikes()
      const likeToDelete: Like | undefined = postLikes.find(
        like => like.userId === this.id
      )

      if (!likeToDelete) {
        return false
      }

      const deleteSuccessful: boolean = await LikeService.delete({
        likeId: likeToDelete.id
      })

      return deleteSuccessful
    } catch (error) {
      console.error('Error unliking post:', error)
      return false
    }
  }
}
