import { useEffect } from 'react'
import {
  useQueryClient,
  useInfiniteQuery,
  useMutation,
  InfiniteData
} from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { PostService } from '../services/PostService'
import { useLoggedUser } from './useLoggedUser'
import { Post } from '../models/Post'
import { QUERY_KEYS } from '../constants/QUERY_KEYS'

export function usePosts (searchQuery?: string) {
  const queryClient = useQueryClient()
  const view = useInView()
  const { loggedUser } = useLoggedUser()
  const queryKey = searchQuery ? [QUERY_KEYS.Posts, searchQuery] : [QUERY_KEYS.Posts]

  const pagination = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      if (searchQuery) {
        return await PostService.search({
          page: pageParam,
          query: searchQuery,
          loggedUser
        })
      } else {
        return await PostService.getAll({ page: pageParam, loggedUser })
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
        (oldPosts: InfiniteData<Post[]>) => {
          if (!oldPosts) return oldPosts

          return {
            ...oldPosts,
            pages: oldPosts.pages.map(posts =>
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
