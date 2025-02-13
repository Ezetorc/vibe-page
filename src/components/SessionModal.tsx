import { useNavigate } from 'react-router'
import { Button } from './Button'
import { Modal } from './Modal'
import { useSettings } from '../hooks/useSettings'
import { CloseModalButton } from './CloseModalButton'

export function SessionModal () {
  const { setVisibleModal, dictionary } = useSettings()
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/login')
    setVisibleModal({ name: null })
  }

  const handleRegister = () => {
    navigate('/register')
    setVisibleModal({ name: null })
  }

  const handleClose = () => {
    setVisibleModal({ name: null })
  }

  return (
    <Modal>
      <article className='p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(400px,80%,600px)]'>
        <CloseModalButton onClose={handleClose} />

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
