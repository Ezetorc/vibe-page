import { useSettings } from '../hooks/useSettings'

export function Loading () {
  const { dictionary } = useSettings()

  return (
    <h3 className='text-[clamp(20px,3rem,60px)] w-screen h-screen flex justify-center items-center'>
      {dictionary.loading}
    </h3>
  )
}
