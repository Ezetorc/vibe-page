import { Button } from './Button'
import { Modal } from './Modal'
import { useSettings } from '../hooks/useSettings'
import { CloseModalButton } from './CloseModalButton'
import { PATHS } from '../constants/PATHS'
import { useLocation } from 'wouter'

export default function SessionModal () {
  const { closeModal, dictionary } = useSettings()
  const [, navigate] = useLocation()

  const handleLogin = () => {
    navigate(PATHS.loginSection)
    closeModal()
  }

  const handleRegister = () => {
    navigate(PATHS.registerSection)
    closeModal()
  }

  return (
    <Modal>
      <article className='p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(300px,fit,500px)]'>
        <CloseModalButton />

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.youAreNotLogged}
        </h2>

        <div className='flex flex-col h-full gap-y-[5px] items-center'>
          <span className='font-poppins-light text-[clamp(20px,4vw,25px)]'>
            {dictionary.iHaveAnAccount}
          </span>
          <Button onClick={handleLogin} text={dictionary.login} />

          <span className='font-poppins-light text-[clamp(20px,4vw,25px)] mt-[40px]'>
            {dictionary.iDontHaveAnAccount}
          </span>
          <Button onClick={handleRegister} text={dictionary.register} />
        </div>
      </article>
    </Modal>
  )
}
