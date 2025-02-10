export interface ToSearchButtonProps {
  text: string
  onClick: () => void
  type: "posts" | "users"
  toSearch: 'posts' | 'users'
}
