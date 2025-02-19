import { EditButtonProps } from "../../../models/Props/EditButtonProps.ts"

export function EditButton (props: EditButtonProps) {
  return (
    <button
      onClick={props.onEdit}
      className='cursor-pointer pt-[5px] grid place-items-center transition-opacity rounded-vibe w-[30px] aspect-square'
    >
      {props.children}
    </button>
  )
}
