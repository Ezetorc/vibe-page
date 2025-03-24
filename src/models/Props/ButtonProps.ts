export interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  text: string
  type?: 'filled' | 'outline'
  classname?: string
  disabled?: boolean
}
