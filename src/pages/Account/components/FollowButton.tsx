import { useEffect, useState } from 'react'
import { Button } from '../../../components/Button'
import { useSettings } from '../../../hooks/useSettings'
import { FollowButtonProps } from '../models/FollowButtonProps'
import { useUser } from '../../../hooks/useUser'

export function FollowButton ({ account }: FollowButtonProps) {
  const { dictionary, setVisibleModal } = useSettings()
  const { user } = useUser()
  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  useEffect(() => {
    const fetchFollowing = async () => { 
      try {
        const following= await user?.isFollowing({
          userId: account.id
        })

        setIsFollowing(following?.value ?? false)
      } catch (error) {
        console.error('Error fetching account:', error)
      }
    }

    fetchFollowing()
  }, [account.id, user])

  const handleFollow = async () => {
    if (!account) return

    if (!user) {
      setVisibleModal({ name: 'session', message: '' })
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
