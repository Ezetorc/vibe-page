import {
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
  useMutation
} from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { PostData } from '../../../models/PostData'
import { PostService } from '../../../services/PostService'
import { UserData } from '../models/UserData'
import { Post } from '../../../models/Post'

export function useUserPosts (userData: UserData, searchQuery?: string) {
  const queryClient = useQueryClient()
  const view = useInView()
  const queryKey = ['posts', 'user', userData.id]
  const pagination = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      if (!userData.id) return [] as Post[]

      if (searchQuery) {
        return userData.user?.searchPosts({
          query: searchQuery,
          page: pageParam
        })
      } else {
        return userData.user?.getPosts({ page: pageParam })
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length + 1 : undefined
  })

  const onDeleteMutationSuccess = (postId: number) => {
    queryClient.setQueryData(
      queryKey,
      (oldPostsData: InfiniteData<PostData[], unknown> | undefined) => {
        if (!oldPostsData) return oldPostsData

        return {
          ...oldPostsData,
          pages: oldPostsData.pages.map(posts =>
            posts.filter(post => post.id !== postId)
          )
        }
      }
    )

    queryClient.setQueryData(
      ['userData', userData.id],
      (prevUserData: UserData | null) => {
        if (!prevUserData?.postsAmount) return prevUserData

        return prevUserData.update({ postsAmount: prevUserData.postsAmount - 1 })
      }
    )
  }

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => PostService.delete({ postId }),
    onSuccess: onDeleteMutationSuccess
  })

  const deletePost = (postId: number) => {
    deleteMutation.mutate(postId)
  }

  useEffect(() => {
    if (view.inView && pagination.hasNextPage) {
      pagination.fetchNextPage()
    }
  }, [pagination, view.inView])

  return {
    status: pagination.status,
    posts:
      pagination.data?.pages.flat().filter(post => post !== undefined) ?? [],
    hasMore: pagination.hasNextPage,
    ref: view.ref,
    deletePost
  }
}
