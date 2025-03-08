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
import { QueryData } from '../../../models/QueryData'

export function useUserPosts (user: User | null, searchQuery?: string) {
  const userPostsKey = 'userPosts'
  const queryClient = useQueryClient()
  const { openModal } = useSettings()
  const { isIntersecting, ref } = useIntersectionObserver({ threshold: 0.5 })
  const userId = user?.id

  const search = useQuery({
    queryKey: userId ? [userPostsKey, userId, 'search', searchQuery] : [],
    queryFn: () => PostService.search({ query: searchQuery! }),
    enabled: !!searchQuery && !!userId
  })

  const pagination = useInfiniteQuery({
    queryKey: userId ? [userPostsKey, userId] : [],
    queryFn: ({ pageParam = 1 }) => user!.getPosts({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length ? allPages.length + 1 : undefined,
    enabled: !!userId && !searchQuery
  })

  const posts: Post[] = searchQuery
    ? search.data || []
    : (pagination.data?.pages.flat().filter(Boolean) as Post[]) || []

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => PostService.delete({ postId }),
    onSuccess: deletedPostId => {
      if (!userId) return
      queryClient.setQueryData(
        [userPostsKey, userId],
        (prevQueryData: QueryData<Post>) => {
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

  const deletePost = (postId: number) => {
    deleteMutation.mutate(postId)
  }

  useEffect(() => {
    const failed = pagination.isError || search.isError
    const success =
      isIntersecting &&
      pagination.hasNextPage &&
      !pagination.isLoading &&
      !searchQuery

    if (success) {
      pagination.fetchNextPage()
    } else if (failed) {
      console.log('ACÁ!')

      openModal('connection')
    }
  }, [isIntersecting, openModal, pagination, search.isError, searchQuery])

  return {
    isError: pagination.isError || search.isError,
    isLoading: pagination.isLoading || search.isLoading,
    fetchNextPage: pagination.fetchNextPage,
    hasNextPage: pagination.hasNextPage,
    data: posts,
    delete: deletePost,
    ref
  }
}
