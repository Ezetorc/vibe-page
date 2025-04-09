import {
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
  useMutation
} from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { PostService } from '../../../services/PostService'
import { Post } from '../../../models/Post'
import { User } from '../../../models/User'
import { useLoggedUser } from '../../../hooks/useLoggedUser'
import { QUERY_KEYS } from '../../../constants/QUERY_KEYS'

export function useUserPosts (user: User, searchQuery?: string) {
  const queryClient = useQueryClient()
  const view = useInView()
  const { loggedUser } = useLoggedUser()
  const queryKey = [QUERY_KEYS.Posts, QUERY_KEYS.User, user.id]
  const pagination = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      if (!user.id) return [] as Post[]

      if (searchQuery) {
        return user.searchPosts({
          query: searchQuery,
          page: pageParam,
          loggedUser
        })
      } else {
        return user.getPosts({ page: pageParam, loggedUser })
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length + 1 : undefined
  })

  const onDeleteMutationSuccess = (postId: number) => {
    queryClient.setQueryData(
      queryKey,
      (oldPosts: InfiniteData<Post[], unknown> | undefined) => {
        if (!oldPosts) return oldPosts

        return {
          ...oldPosts,
          pages: oldPosts.pages.map(posts =>
            posts.filter(post => post.id !== postId)
          )
        }
      }
    )

    queryClient.setQueryData([QUERY_KEYS.User, user.id], (prevUserData?: User) => {
      if (!prevUserData?.postsAmount) return prevUserData

      return prevUserData.update({ postsAmount: prevUserData.postsAmount - 1 })
    })
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
