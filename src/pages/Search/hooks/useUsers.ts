import {
  useQueryClient,
  useQuery,
  useInfiniteQuery,
  useMutation
} from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useIntersectionObserver } from 'usehooks-ts'
import { useSettings } from '../../../hooks/useSettings'
import { UserService } from '../../../services/UserService'
import { User } from '../../../models/User'
import { QueryData } from '../../../models/QueryData'

export function useUsers (searchQuery?: string) {
  const usersKey = 'users'
  const queryClient = useQueryClient()
  const { openModal } = useSettings()
  const { isIntersecting, ref } = useIntersectionObserver({ threshold: 0.5 })

  const search = useQuery({
    queryKey: [usersKey, searchQuery],
    queryFn: () => UserService.search({ query: searchQuery! }),
    enabled: !!searchQuery
  })

  const pagination = useInfiniteQuery({
    queryKey: [usersKey],
    queryFn: ({ pageParam = 1 }) => UserService.getAll({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length ? allPages.length + 1 : undefined,
    enabled: !searchQuery
  })

  const data = searchQuery
    ? search.data || []
    : (pagination.data?.pages.flat().filter(Boolean) as User[]) || []

  const deleteMutation = useMutation({
    mutationFn: (userId: number) => UserService.delete({ userId }),
    onSuccess: deletedUserId => {
      queryClient.setQueryData([usersKey], (prevQueryData: QueryData<User>) => {
        if (!prevQueryData) return prevQueryData

        const newPages = prevQueryData.pages.map(page =>
          page.filter(user => user.id !== deletedUserId)
        )

        const newQueryData = {
          ...prevQueryData,
          pages: newPages
        }

        return newQueryData
      })
    }
  })

  const deleteUser = (userId: number) => {
    deleteMutation.mutate(userId)
  }

  const handleMoreUsers = useCallback(() => {
    const failed = pagination.isError || search.isError
    const success =
      isIntersecting &&
      pagination.hasNextPage &&
      !pagination.isLoading &&
      !searchQuery

    if (success) {
      pagination.fetchNextPage()
    } else if (failed) {
      openModal('connection')
    }
  }, [isIntersecting, openModal, pagination, search.isError, searchQuery])

  useEffect(() => {
    handleMoreUsers()
  }, [handleMoreUsers])

  return {
    isError: pagination.isError || search.isError,
    isLoading: pagination.isLoading || search.isLoading,
    fetchNextPage: pagination.fetchNextPage,
    hasNextPage: pagination.hasNextPage,
    data,
    delete: deleteUser,
    ref
  }
}
