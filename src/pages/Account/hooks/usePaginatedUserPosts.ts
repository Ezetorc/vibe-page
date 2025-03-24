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
import { UserService } from '../../../services/UserService'
import { Post } from '../../../models/Post'

export function usePaginatedUserPosts (userData: UserData) {
  const queryClient = useQueryClient()
  const view = useInView()
  const queryKey = ['posts', 'user', userData.name]
  const pagination = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      if (!userData.id) return [] as Post[]

      const user = await UserService.getById({ userId: userData.id })

      return user?.getPosts({ page: pageParam })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length + 1 : undefined
  })

  const onDeleteMutationSuccess = (postId: number) => {
    queryClient.setQueryData(
      queryKey,
      (oldData: InfiniteData<PostData[], unknown> | undefined) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map(posts =>
            posts.filter(post => post.id !== postId)
          )
        }
      }
    )

    queryClient.setQueryData(['userData', 'me'], (oldData: UserData | null) => {
      if (!oldData?.postsAmount) return oldData

      return new UserData({
        id: oldData.id,
        name: oldData.name,
        imageId: oldData.imageId,
        imageUrl: oldData.imageUrl,
        description: oldData.description,
        date: oldData.date,
        postsAmount: oldData.postsAmount - 1,
        followersAmount: oldData.followersAmount,
        followingAmount: oldData.followingAmount,
        isLogged: oldData.isLogged
      })
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
