import { Post } from '../Post'

export interface PostDisplayProps {
  post: Post
  onDelete: (postId: number) => void
}
