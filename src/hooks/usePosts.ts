import { useEffect } from 'react'
import {
  useQueryClient,
  useInfiniteQuery,
  useMutation,
  InfiniteData
} from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { PostService } from '../services/PostService'
import { Post } from '../models/Post'
import { User } from '../models/User'
import { UserInteractions } from '../models/UserInteractions'
import { QUERY_KEYS } from '../constants/QUERY_KEYS'

export function usePosts (searchQuery?: string, user?: User) {
  const queryClient = useQueryClient()
  const view = useInView()
  const queryKey = QUERY_KEYS.posts(user?.id, searchQuery)

  const queryFn = async ({ pageParam = 1 }) => {
    if (user)
      return searchQuery
        ? user.searchPosts({ query: searchQuery, page: pageParam })
        : user.getPosts({ page: pageParam })

    return searchQuery
      ? PostService.search({ query: searchQuery, page: pageParam })
      : PostService.getAll({ page: pageParam })
  }

  const pagination = useInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length + 1 : undefined
  })

  const deleteMutation = useMutation({
    mutationFn: (post: Post) => PostService.delete({ postId: post.id }),
    onMutate: (post: Post) => {
      queryClient.setQueriesData<InfiniteData<Post[]>>(
        {
          queryKey: QUERY_KEYS.posts(),
          exact: false
        },
        prev => {
          if (!prev) return prev

          return {
            ...prev,
            pages: prev.pages.map(posts =>
              posts.filter(postInPage => postInPage.id !== post.id)
            )
          }
        }
      )

      if (user) {
        queryClient.setQueryData<UserInteractions>(
          QUERY_KEYS.userInteractions(user.id),
          prev =>
            prev
              ? prev.update({ postsAmount: prev.postsAmount - 1 })
              : undefined
        )
      }
    }
  })

  useEffect(() => {
    if (view.inView && pagination.hasNextPage) {
      pagination.fetchNextPage()
    }
  }, [pagination, view.inView])

  return {
    posts: pagination.data?.pages.flat().toReversed() ?? [],
    hasMore: pagination.hasNextPage,
    ref: view.ref,
    deletePost: deleteMutation.mutate,
    isEmpty: (pagination.data?.pages.flat() ?? []).length === 0,
    success: pagination.status === 'success',
    failed: pagination.status === 'error'
  }
}
