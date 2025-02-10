import { EditButtonProps } from "../models/EditButtonProps.ts"

export function EditButton ({ children, onEdit }: EditButtonProps) {
  return (
    <button
      onClick={onEdit}
      className='p-[1%] mb-[2%] transition-opacity rounded-vibe h-[24px] aspect-square'
    >
      {children}
    </button>
  )
}
