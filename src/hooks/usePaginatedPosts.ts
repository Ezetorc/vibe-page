import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { PostService } from '../services/PostService'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { PostData } from '../models/PostData'

export function usePaginatedPosts () {
  const queryClient = useQueryClient()
  const view = useInView()

  const pagination = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => PostService.getAll({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length + 1 : undefined
  })

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => PostService.delete({ postId }),
    onSuccess: (postId: number) => {
      queryClient.setQueryData(
        ['posts'],
        (oldData: InfiniteData<PostData[]>) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map(posts =>
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
    deletePost: (postId: number) => deleteMutation.mutate(postId)
  }
}
