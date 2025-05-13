import { useQuery } from '@tanstack/react-query'
import { PostService } from '../../../services/PostService'
import { QUERY_KEYS } from '../../../constants/QUERY_KEYS'

export function usePost (postId?: number) {
  const query = useQuery({
    queryKey: QUERY_KEYS.post(postId),
    queryFn: () => PostService.getById({ postId: postId! }),
    enabled: postId !== undefined
  })

  return {
    post: query.data ?? null,
    isLoading: query.isLoading
  }
}
