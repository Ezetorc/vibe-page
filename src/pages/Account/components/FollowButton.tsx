import { useEffect, useState } from 'react'
import { Button } from '../../../components/Button'
import { useSettings } from '../../../hooks/useSettings'
import { FollowButtonProps } from '../models/FollowButtonProps'
import { useUser } from '../../../hooks/useUser'

export function FollowButton ({ account }: FollowButtonProps) {
  const { dictionary, setSessionModalVisible } = useSettings()
  const { user } = useUser()
  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const following: boolean | undefined = await user?.isFollowing(
          account.id
        )

        setIsFollowing(following ?? false)
      } catch (error) {
        console.error('Error fetching account:', error)
      }
    }

    fetchFollowing()
  }, [account.id, user])

  const handleFollow = async () => {
    if (!account) return

    if (!user) {
      setSessionModalVisible(true)
      return
    }

    if (!isFollowing) {
      await user.follow(account.id)
      setIsFollowing(true)
    } else {
      await user.unfollow(account.id)
      setIsFollowing(false)
    }
  }

  return (
    <Button
      onClick={handleFollow}
      text={
        isFollowing === null
          ? dictionary.loading?.value
          : isFollowing
          ? dictionary.unfollow?.value
          : dictionary.follow?.value
      }
    />
  )
}
