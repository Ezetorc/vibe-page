import {
  useQueryClient,
  useQuery,
  useInfiniteQuery,
  useMutation
} from '@tanstack/react-query'
import { useEffect } from 'react'
import { useIntersectionObserver } from 'usehooks-ts'
import { useSettings } from '../../../hooks/useSettings'
import { Post } from '../../../models/Post'
import { User } from '../../../models/User'
import { PostService } from '../../../services/PostService'

export function useUserPosts (user: User | null, searchQuery?: string) {
  const queryClient = useQueryClient()
  const { setVisibleModal } = useSettings()
  const { isIntersecting, ref } = useIntersectionObserver({ threshold: 0.5 })

  const userId = user?.id

  const {
    data: searchResults,
    isError: isSearchError,
    isLoading: isSearchLoading
  } = useQuery({
    queryKey: userId ? ['userPosts', userId, 'search', searchQuery] : [],
    queryFn: () => PostService.search({ query: searchQuery! }),
    enabled: !!searchQuery && !!userId
  })

  const {
    data: paginatedData,
    fetchNextPage,
    hasNextPage,
    isError: isPaginationError,
    isLoading: isPaginationLoading
  } = useInfiniteQuery({
    queryKey: userId ? ['userPosts', userId] : [],
    queryFn: ({ pageParam = 1 }) => user!.getPosts({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.value?.length ? allPages.length + 1 : undefined,
    enabled: !!userId && !searchQuery
  })

  const posts: Post[] = searchQuery
    ? searchResults?.value || []
    : (paginatedData?.pages
        .flatMap(post => post.value)
        .filter(Boolean) as Post[]) || []

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => PostService.delete({ postId }),
    onSuccess: deletedPostId => {
      if (!userId) return
      queryClient.setQueryData(
        ['userPosts', userId],
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
    data: posts,
    delete: deletePost,
    ref
  }
}
