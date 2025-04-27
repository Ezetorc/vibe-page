import { LoadSpinner } from './LoadSpinner'

export function Loading () {
  return (
    <div className='w-screen h-screen scale-200 absolute top-0 left-0 grid place-items-center'>
      <LoadSpinner />
    </div>
  )
}
