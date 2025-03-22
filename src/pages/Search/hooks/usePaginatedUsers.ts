import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { UserService } from '../../../services/UserService'
import { UserData } from '../../Account/models/UserData'

export function usePaginatedUsers () {
  const queryClient = useQueryClient()
  const view = useInView()
  const pagination = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam = 1 }) => UserService.getAll({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length + 1 : undefined
  })

  const onDeleteMutationSuccess = (userId: number) => {
    queryClient.setQueryData(
      ['users'],
      (oldData: InfiniteData<UserData[], unknown> | undefined) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map(users =>
            users.filter(user => user.id !== userId)
          )
        }
      }
    )
  }

  const deleteMutation = useMutation({
    mutationFn: ({ userId, imageId }: { userId: number; imageId: string }) =>
      UserService.delete({ userId, imageId }),
    onSuccess: onDeleteMutationSuccess
  })

  const deleteUser = (userId: number, imageId: string) => {
    deleteMutation.mutate({ userId, imageId })
  }

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
    deleteUser
  }
}
