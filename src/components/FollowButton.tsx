import { Button } from './Button'
import { useSettings } from '../hooks/useSettings'
import { useFollow } from '../hooks/useFollow'
import { User } from '../models/User'
import { useSession } from '../hooks/useSession'

export function FollowButton (props: { following: User | null }) {
  const { dictionary } = useSettings()
  const { isSessionActive } = useSession()
  const { isFollowing, handleFollow, isLoading } = useFollow(props.following)
  const filled = !isSessionActive
    ? true
    : isFollowing === undefined
    ? false
    : true
  const text = !isSessionActive
    ? dictionary.follow
    : isFollowing === undefined
    ? dictionary.loading
    : isFollowing
    ? dictionary.unfollow
    : dictionary.follow

  return (
    <Button
      loading={isLoading}
      onClick={handleFollow}
      classname='w-full'
      filled={filled}
      text={text}
    />
  )
}
