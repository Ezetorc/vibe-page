import { CloseModalButtonProps } from "../models/CloseModalButtonProps";

export function CloseModalButton ({ onClose}: CloseModalButtonProps) {
  return (
    <button
      onClick={onClose}
      className='absolute top-0 right-0 pr-[2%] pt-[1%] font-poppins-semibold text-[clamp(15px,4vw,20px)]'
    >
      X
    </button>
  )
}
