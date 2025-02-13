import { useCallback, useEffect, useState } from 'react'
import { Button } from '../../../components/Button'
import { useSettings } from '../../../hooks/useSettings'
import { FollowButtonProps } from '../models/FollowButtonProps'
import { useUser } from '../../../hooks/useUser'

export function FollowButton ({ account }: FollowButtonProps) {
  const { dictionary, setVisibleModal } = useSettings()
  const { user } = useUser()
  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  const fetchFollowing = useCallback(async () => {
    if (!user) {
      setVisibleModal({ name: 'session' })
      return
    }

    const following = await user.isFollowing({
      userId: account.id
    })

    if (!following.value) {
      setVisibleModal({ name: 'connection' })
      return
    }

    setIsFollowing(following.value)
  }, [account.id, user, setVisibleModal])

  const handleFollow = async () => {
    if (!user) {
      setVisibleModal({ name: 'session' })
      return
    }

    if (!isFollowing) {
      await user.follow({ userId: account.id })
      setIsFollowing(true)
    } else {
      await user.unfollow({ userId: account.id })
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
