import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { UserService } from '../../../services/UserService'

export function useUsers (searchQuery?: string) {
  const queryKey = searchQuery ? ['users', searchQuery] : ['users']
  const view = useInView()
  const pagination = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      if (searchQuery) {
        return await UserService.search({ page: pageParam, query: searchQuery })
      } else {
        return await UserService.getAll({ page: pageParam })
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length + 1 : undefined
  })

  useEffect(() => {
    if (view.inView && pagination.hasNextPage) {
      pagination.fetchNextPage()
    }
  }, [pagination, view.inView])

  return {
    status: pagination.status,
    users: pagination.data?.pages.flat() ?? [],
    hasMore: pagination.hasNextPage,
    ref: view.ref,
    isEmpty: (pagination.data?.pages.flat() ?? []).length === 0,
    success: pagination.status === 'success'
  }
}
