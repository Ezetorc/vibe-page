export function ErrorMessage (props: { value: string | null | undefined }) {
  return (
    <div className='text-red-500 font-poppins-light w-full h-[30px]'>
      {props.value}
    </div>
  )
}
