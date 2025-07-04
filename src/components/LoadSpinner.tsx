export function LoadSpinner (props: {
  reference?: ((node?: Element | null) => void) | null
}) {
  return (
    <div ref={props.reference} className='flex justify-center py-4'>
      <span className='animate-spin h-8 w-8 border-4 border-caribbean-current border-t-transparent rounded-full'></span>
    </div>
  )
}
