import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { User } from '../../../models/User'
import { useCallback, useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import { Notification } from '../../../models/Notification'
import { NotificationService } from '../../../services/NotificationService'
import { QUERY_KEYS } from '../../../constants/QUERY_KEYS'

export function useNotifications (user: User | null) {
  const queryClient = useQueryClient()
  const view = useInView()
  const queryKey = QUERY_KEYS.notifications(user?.id)

  const pagination = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => user!.getNotifications({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length + 1 : undefined,
    enabled: Boolean(user)
  })

  const isEmpty = (pagination.data?.pages.flat() ?? []).length === 0
  const notifications = useMemo(
    () => pagination.data?.pages.flat().toReversed() ?? [],
    [pagination.data?.pages]
  )

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

  const clearNotifications = () => {
    if (!isEmpty) {
      clearMutation.mutate()
    }
  }

  const markAsSeen = useCallback(() => {
    if (isEmpty) return

    const notificationsIds: number[] = notifications.map(
      notification => notification.id
    )

    NotificationService.markAsSeen({ notificationsIds })

    queryClient.setQueryData(
      QUERY_KEYS.hasNotifications(),
      (prevHasNotifications?: boolean) => {
        if (prevHasNotifications === undefined) return prevHasNotifications

        return false
      }
    )
  }, [isEmpty, notifications, queryClient])

  useEffect(() => {
    if (view.inView && pagination.hasNextPage) {
      pagination.fetchNextPage()
    }
  }, [pagination, view.inView])

  return {
    notifications,
    hasMore: pagination.hasNextPage,
    ref: view.ref,
    clearNotifications,
    markAsSeen,
    isEmpty,
    success: pagination.status === 'success'
  }
}
