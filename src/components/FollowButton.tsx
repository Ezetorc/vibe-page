import { Button } from './Button'
import { useSettings } from '../hooks/useSettings'
import { useFollow } from '../hooks/useFollow'
import { User } from '../models/User'
import { useSession } from '../hooks/useSession'

export function FollowButton (props: { following: User | null }) {
  const { dictionary, openModal } = useSettings()
  const { isSessionActive } = useSession()
  const { isFollowing, follow, unfollow, isLoading } = useFollow(
    props.following
  )

  const handleFollow = () => {
    if (isSessionActive) {
      if (isFollowing) {
        unfollow()
      } else {
        follow()
      }
    } else {
      openModal('session')
    }
  }

  return (
    <Button
      loading={isLoading}
      onClick={handleFollow}
      type={
        !isSessionActive
          ? 'filled'
          : isFollowing === null
          ? 'outline'
          : 'filled'
      }
      text={
        !isSessionActive
          ? dictionary.follow
          : isFollowing === null
          ? dictionary.loading
          : isFollowing
          ? dictionary.unfollow
          : dictionary.follow
      }
    />
  )
}
