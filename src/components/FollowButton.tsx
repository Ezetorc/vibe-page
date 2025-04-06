import { Button } from './Button'
import { useSettings } from '../hooks/useSettings'
import { useFollow } from '../hooks/useFollow'
import { useUser } from '../hooks/useUser'
import { User } from '../models/User'

export function FollowButton (props: { following: User | null }) {
  const { isSessionActive } = useUser()
  const { dictionary, openModal } = useSettings()
  const { isFollowing, follow, unfollow } = useFollow(props.following)

  const handleFollow = () => {
    if (isSessionActive()) {
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
      onClick={handleFollow}
      type={
        !isSessionActive()
          ? 'filled'
          : isFollowing === null
          ? 'outline'
          : 'filled'
      }
      text={
        !isSessionActive()
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
