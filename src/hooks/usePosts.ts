import { useEffect } from 'react'
import {
  useQueryClient,
  useInfiniteQuery,
  useMutation,
  InfiniteData
} from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { PostData } from '../models/PostData'
import { PostService } from '../services/PostService'

export function usePosts (searchQuery?: string) {
  const queryClient = useQueryClient()
  const view = useInView()
  const queryKey = searchQuery ? ['posts', searchQuery] : ['posts']

  const pagination = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      if (searchQuery) {
        return await PostService.search({
          page: pageParam,
          query: searchQuery
        })
      } else {
        return await PostService.getAll({ page: pageParam })
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length + 1 : undefined
  })

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => PostService.delete({ postId }),
    onSuccess: (postId: number) => {
      queryClient.setQueryData(
        queryKey,
        (oldPostData: InfiniteData<PostData[]>) => {
          if (!oldPostData) return oldPostData

          return {
            ...oldPostData,
            pages: oldPostData.pages.map(posts =>
              posts.filter(post => post.id !== postId)
            )
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
    posts: pagination.data?.pages.flat() ?? [],
    hasMore: pagination.hasNextPage,
    ref: view.ref,
    deletePost: (postId: number) => deleteMutation.mutate(postId),
    isEmpty: (pagination.data?.pages.flat() ?? []).length === 0,
    success: pagination.status === 'success'
  }
}
