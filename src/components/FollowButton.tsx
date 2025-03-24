import { Button } from './Button'
import { useSettings } from '../hooks/useSettings'
import { useFollow } from '../hooks/useFollow'
import { FollowButtonProps } from '../models/Props/FollowButtonProps'

export function FollowButton (props: FollowButtonProps) {
  const { dictionary } = useSettings()
  const { isFollowing, follow, unfollow } = useFollow(props.followerId, props.followingId)

  const handleFollow = () => {
    if (isFollowing) {
      unfollow()
    } else {
      follow()
    }
  }

  return (
    <Button
      onClick={handleFollow}
      text={
        isFollowing === null
          ? dictionary.loading
          : isFollowing
          ? dictionary.unfollow
          : dictionary.follow
      }
    />
  )
}
