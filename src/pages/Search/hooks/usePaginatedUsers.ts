import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { UserService } from '../../../services/UserService'

export function usePaginatedUsers () {
  const view = useInView()

  const pagination = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam = 1 }) => UserService.getAll({ page: pageParam }),
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
    ref: view.ref
  }
}
