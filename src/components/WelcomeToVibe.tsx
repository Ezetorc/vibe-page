import { useSettings } from '../hooks/useSettings'

export function WelcomeToVibe () {
  const { dictionary } = useSettings()

  return (
    <div className='w-full flex flex-col items-center pt-[10%]'>
      <span className='font-poppins-light text-white text-[clamp(20px,2vw,25px)]'>
        {dictionary.welcomeTo?.value}
      </span>
      <h2 className='my-[-6%] font-poppins-semibold text-[clamp(60px,15vw,100px)] bg-clip-text text-transparent bg-orange-gradient'>
        VIBE
      </h2>
    </div>
  )
}
