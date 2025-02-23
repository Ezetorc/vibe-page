import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery
} from '@tanstack/react-query'
import { PostService } from '../services/PostService'
import { Post } from '../models/Post'
import { useIntersectionObserver } from 'usehooks-ts'
import { useEffect } from 'react'
import { useSettings } from './useSettings'

export function usePosts (searchQuery?: string) {
  const queryClient = useQueryClient()
  const { setVisibleModal } = useSettings()
  const { isIntersecting, ref } = useIntersectionObserver({ threshold: 0.5 })

  const {
    data: searchResults,
    isError: isSearchError,
    isLoading: isSearchLoading
  } = useQuery({
    queryKey: ['posts', searchQuery],
    queryFn: () => PostService.search({ query: searchQuery! }),
    enabled: !!searchQuery
  })

  const {
    data: paginatedData,
    fetchNextPage,
    hasNextPage,
    isError: isPaginationError,
    isLoading: isPaginationLoading
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => PostService.getAll({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.value?.length ? allPages.length + 1 : undefined,
    enabled: !searchQuery
  })

  const data: Post[] = searchQuery
    ? searchResults?.value || []
    : (paginatedData?.pages
        .flatMap(post => post.value)
        .filter(Boolean) as Post[]) || []

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => PostService.delete({ postId }),
    onSuccess: deletedPostId => {
      queryClient.setQueryData(
        ['posts'],
        (oldData: { pages: { value: Post[] }[] }) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              value: page.value.filter(post => post.id !== deletedPostId.value)
            }))
          }
        }
      )
    }
  })

  const deletePost = (postId: number) => {
    deleteMutation.mutate(postId)
  }

  useEffect(() => {
    if (isPaginationError || isSearchError) {
      setVisibleModal({ name: 'connection' })
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
    setVisibleModal,
    searchQuery
  ])

  return {
    isError: isPaginationError || isSearchError,
    isLoading: isPaginationLoading || isSearchLoading,
    fetchNextPage,
    hasNextPage,
    data,
    delete: deletePost,
    ref
  }
}
