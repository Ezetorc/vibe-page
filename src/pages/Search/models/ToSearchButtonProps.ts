import { MouseEventHandler } from 'react'

export interface ToSearchButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>
  type: 'posts' | 'users'
  toSearch: 'posts' | 'users'
}
