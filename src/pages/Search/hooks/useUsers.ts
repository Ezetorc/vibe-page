import {
  useQueryClient,
  useQuery,
  useInfiniteQuery,
  useMutation
} from '@tanstack/react-query'
import { useEffect } from 'react'
import { useIntersectionObserver } from 'usehooks-ts'
import { useSettings } from '../../../hooks/useSettings'
import { UserService } from '../../../services/UserService'
import { User } from '../../../models/User'

export function useUsers (searchQuery?: string) {
  const queryClient = useQueryClient()
  const { openModal } = useSettings()
  const { isIntersecting, ref } = useIntersectionObserver({ threshold: 0.5 })

  const {
    data: searchResults,
    isError: isSearchError,
    isLoading: isSearchLoading
  } = useQuery({
    queryKey: ['users', searchQuery],
    queryFn: () => UserService.search({ query: searchQuery! }),
    enabled: !!searchQuery
  })

  const {
    data: paginatedData,
    fetchNextPage,
    hasNextPage,
    isError: isPaginationError,
    isLoading: isPaginationLoading
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam = 1 }) => UserService.getAll({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.value?.length ? allPages.length + 1 : undefined,
    enabled: !searchQuery
  })

  const data: User[] = searchQuery
    ? searchResults?.value || []
    : (paginatedData?.pages
        .flatMap(post => post.value)
        .filter(Boolean) as User[]) || []

  const deleteMutation = useMutation({
    mutationFn: (userId: number) => UserService.delete({ userId }),
    onSuccess: deletedUserId => {
      queryClient.setQueryData(
        ['users'],
        (oldData: { pages: { value: User[] }[] }) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              value: page.value.filter(user => user.id !== deletedUserId.value)
            }))
          }
        }
      )
    }
  })

  const deleteUser = (userId: number) => {
    deleteMutation.mutate(userId)
  }

  useEffect(() => {
    if (isPaginationError || isSearchError) {
      openModal('connection')
    } else if (
      isIntersecting &&
      hasNextPage &&
      !isPaginationLoading &&
      !searchQuery
    ) {
      fetchNextPage()
    }
  }, [
    isIntersecting,
    fetchNextPage,
    hasNextPage,
    isPaginationLoading,
    isPaginationError,
    isSearchError,
    openModal,
    searchQuery
  ])

  return {
    isError: isPaginationError || isSearchError,
    isLoading: isPaginationLoading || isSearchLoading,
    fetchNextPage,
    hasNextPage,
    data,
    delete: deleteUser,
    ref
  }
}
