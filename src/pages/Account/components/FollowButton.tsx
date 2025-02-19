import { useCallback, useEffect, useState } from 'react'
import { Button } from '../../../components/Button'
import { useSettings } from '../../../hooks/useSettings'
import { FollowButtonProps } from '../models/FollowButtonProps'
import { useUser } from '../../../hooks/useUser'

export function FollowButton (props: FollowButtonProps) {
  const { dictionary, setVisibleModal } = useSettings()
  const { user } = useUser()
  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  const fetchFollowing = useCallback(async () => {
    if (!user) {
      setVisibleModal({ name: 'session' })
      return
    }

    const following = await user.isFollowing({
      userId: props.user.id
    })

    if (!following.success) {
      setVisibleModal({ name: 'connection' })
      return
    }

    setIsFollowing(following.value as boolean)
  }, [props.user.id, user, setVisibleModal])

  const handleFollow = async () => {
    if (!user) {
      setVisibleModal({ name: 'session' })
      return
    }

    if (!isFollowing) {
      await user.follow({ userId: props.user.id })
      setIsFollowing(true)
    } else {
      await user.unfollow({ userId: props.user.id })
      setIsFollowing(false)
    }
  }

  useEffect(() => {
    fetchFollowing()
  }, [fetchFollowing])

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
