import { useQuery } from '@tanstack/react-query'
import { CommentService } from '../../../services/CommentService'
import { QUERY_KEYS } from '../../../constants/QUERY_KEYS'

export function useComment (commentId?: number) {
  const query = useQuery({
    queryKey: QUERY_KEYS.comment(commentId),
    queryFn: async () => {
      if (commentId !== undefined) {
        return await CommentService.getById({ commentId })
      } else {
        return null
      }
    }
  })

  return {
    comment: query.data ?? null,
    isLoading: query.isLoading
  }
}
