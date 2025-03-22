export interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  text: string
  classname?: string
  disabled?: boolean
}
