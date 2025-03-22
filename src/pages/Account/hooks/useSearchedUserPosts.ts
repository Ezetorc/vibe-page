import { UserData } from './../models/UserData'
import { useQuery } from '@tanstack/react-query'
import { UserService } from '../../../services/UserService'
import { Post } from '../../../models/Post'

export function useSearchedUserPosts (userData: UserData, searchQuery?: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', 'user', searchQuery],
    queryFn: async () => {
      if (!userData.id) return [] as Post[]

      const user = await UserService.getById({ userId: userData.id })

      return searchQuery ? user?.searchPosts({ query: searchQuery }) : []
    },
    enabled: Boolean(searchQuery),
    staleTime: 1000 * 60 * 5
  })

  return {
    posts: data || [],
    isLoading,
    isError
  }
}
