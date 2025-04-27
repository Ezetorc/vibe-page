import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { User } from '../../../models/User'
import { QUERY_KEYS } from '../../../constants/QUERY_KEYS'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Notification } from '../../../models/Notification'

export function useNotifications (user: User | null) {
  const queryClient = useQueryClient()
  const view = useInView()
  const queryKey = [QUERY_KEYS.Notifications, user!.id]

  const pagination = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => user!.getNotifications({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length + 1 : undefined,
    enabled: !!user
  })

  const clearMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        return false
      } else {
        return await user.clearNotifications()
      }
    },
    onMutate: () => {
      queryClient.setQueryData(
        queryKey,
        (oldNotifications: InfiniteData<Notification[]>) => {
          if (!oldNotifications) return oldNotifications

          return {
            ...oldNotifications,
            pages: []
          }
        }
      )
    }
  })

  useEffect(() => {
    if (view.inView && pagination.hasNextPage) {
      pagination.fetchNextPage()
    }
  }, [pagination, view.inView])

  return {
    status: pagination.status,
    notifications: pagination.data?.pages.flat().toReversed() ?? [],
    hasMore: pagination.hasNextPage,
    ref: view.ref,
    clearNotifications: () => clearMutation.mutate(),
    isEmpty: (pagination.data?.pages.flat() ?? []).length === 0,
    success: pagination.status === 'success',
    failed: pagination.status === 'error'
  }
}
