import { useQuery } from '@tanstack/react-query'
import { User } from '../../../models/User'
import { PostService } from '../../../services/PostService'
import { FollowService } from '../../../services/FollowService'
import { QUERY_KEYS } from '../../../constants/QUERY_KEYS'

export function useUserInteractions (user: User) {
  const query = useQuery({
    queryKey: QUERY_KEYS.userInteractions(user.id),
    queryFn: async () => {
      const [postsAmount, followersAmount, followingAmount] = await Promise.all(
        [
          PostService.getAmountOfUser({ userId: user.id }),
          FollowService.getFollowersAmount({ userId: user.id }),
          FollowService.getFollowingAmount({ userId: user.id })
        ]
      )

      return { postsAmount, followersAmount, followingAmount }
    }
  })

  return {
    isLoading: query.isLoading,
    postsAmount: query.data?.postsAmount,
    followersAmount: query.data?.followersAmount,
    followingAmount: query.data?.followingAmount
  }
}
