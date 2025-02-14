import { Comment } from './Comment'

export interface CommentDisplayProps {
  comment: Comment
  onDelete: (commentId: number) => void
}
