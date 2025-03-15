import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery
} from '@tanstack/react-query'
import { PostService } from '../services/PostService'
import { Post } from '../models/Post'
import { useIntersectionObserver } from 'usehooks-ts'
import { useCallback, useEffect } from 'react'
import { useSettings } from './useSettings'
import { QueryData } from '../models/QueryData'

export function usePosts (searchQuery?: string) {
  const postsKey = 'posts'
  const queryClient = useQueryClient()
  const { openModal } = useSettings()
  const { isIntersecting, ref } = useIntersectionObserver({ threshold: 0.5 })

  const search = useQuery({
    queryKey: [postsKey, searchQuery],
    queryFn: () => PostService.search({ query: searchQuery! }),
    enabled: Boolean(searchQuery),
    staleTime: 1000 * 60 * 5
  })

  const pagination = useInfiniteQuery({
    queryKey: [postsKey],
    queryFn: ({ pageParam = 1 }) => PostService.getAll({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length + 1 : undefined,
    enabled: !searchQuery,
    staleTime: 1000 * 60 * 5
  })

  const data: Post[] = searchQuery
    ? search.data || []
    : (pagination.data?.pages.flat().filter(Boolean) as Post[]) || []

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => PostService.delete({ postId }),
    onSuccess: deletedPostId => {
      queryClient.setQueryData(
        [postsKey],
        (prevQueryData: QueryData<Post> | undefined) => {
          if (!prevQueryData) return prevQueryData

          const newPages = prevQueryData.pages.map(page =>
            page.filter(post => post.id !== deletedPostId)
          )

          const newQueryData = {
            ...prevQueryData,
            pages: newPages
          }

          return newQueryData
        }
      )
    }
  })

  const deletePost = async (postId: number) => {
    deleteMutation.mutate(postId)
  }

  const handleMorePosts = useCallback(() => {
    const failed = pagination.isError || search.isError
    const success =
      isIntersecting &&
      pagination.hasNextPage &&
      !pagination.isLoading &&
      !search.isLoading &&  
      !searchQuery
  
    if (success) {
      pagination.fetchNextPage()
    } else if (failed) {
      openModal('connection')
    }
  }, [isIntersecting, openModal, pagination, search.isError, search.isLoading, searchQuery]);
  
  

  useEffect(() => {
    handleMorePosts()
  }, [handleMorePosts])

  return {
    isError: pagination.isError || search.isError,
    isLoading: pagination.isLoading || search.isLoading,
    fetchNextPage: pagination.fetchNextPage,
    hasNextPage: pagination.hasNextPage,
    data,
    delete: deletePost,
    ref
  }
}
