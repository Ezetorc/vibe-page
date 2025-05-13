import { Comment } from '../models/Comment'
import { Post } from '../models/Post'

export const QUERY_KEYS = {
  comments: (postId?: number) => ['comments', postId],
  comment: (commentId?: number) => ['comment', commentId],
  post: (postId?: number) => ['post', postId],
  userInteractions: (userId?: number) => ['userInteractions', userId],
  isFollowing: (followerId?: number, followingId?: number) => [
    followerId,
    'isFollowing',
    followingId
  ],
  hasNotifications: () => ['hasNotifications'],
  userLiked: (userId?: number, target?: Post | Comment) => [
    'userLiked',
    userId,
    target instanceof Post ? 'post' : 'comment',
    target?.id
  ],
  posts: (userId?: number, searchQuery?: string) => [
    'posts',
    { userId: userId ?? null, query: searchQuery || null }
  ],
  user: (userId?: number) => ['user', userId],
  notifications: (userId?: number) => ['notifications', userId]
}
