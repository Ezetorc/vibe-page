import { PATHS } from '../constants/PATHS'
import { useSettings } from '../hooks/useSettings'
import { User } from '../models/User'

export function UserImage (props: {
  user?: User | null
  src?: string
  className?: string
  title?: string
}) {
  const { dictionary } = useSettings()
  const title = props.title
    ? props.title
    : props.user
    ? props.user.name
    : dictionary.loading
  const src = props.src ? props.src : props.user?.imageUrl ?? PATHS.guestImage

  return (
    <img
      title={title}
      className={`${props.className} rounded-user-image aspect-square border-vibe border-caribbean-current`}
      src={src}
      alt={props.user?.name}
    />
  )
}
