import { Post } from '../Post'

export interface PostsDisplayProps {
  posts?: Post[] | null
  onPostDelete: (postId: number) => void
}
