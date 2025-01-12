interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  text: string
}

export function Button ({ onClick, text }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className='cursor-pointer hover:bg-white hover:text-orange-crayola w-full h-[50px] bg-orange-crayola font-poppins-regular rounded-vibe'
    >
      {text}
    </button>
  )
}
