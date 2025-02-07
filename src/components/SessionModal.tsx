import { useNavigate } from 'react-router'
import { Button } from './Button'
import { Modal } from './Modal'
import { useSettings } from '../hooks/useSettings'

export function SessionModal () {
  const { setSessionModalVisible, dictionary } = useSettings()
  const navigate = useNavigate()

  const handleLogin = (): void => {
    navigate('/login')
    setSessionModalVisible(false)
  }

  const handleRegister = (): void => {
    navigate('/register')
    setSessionModalVisible(false)
  }

  const handleClose = (): void => {
    setSessionModalVisible(false)
  }

  return (
    <Modal>
      <article className='p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(400px,80%,600px)]'>
        <button
          onClick={handleClose}
          className='absolute top-0 right-0 pr-[2%] pt-[1%] font-poppins-semibold text-[clamp(15px,4vw,20px)]'
        >
          X
        </button>

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.youAreNotLogged?.value}
        </h2>

        <div className='flex flex-col h-full gap-y-[5px] items-center'>
          <span className='font-poppins-light text-[clamp(20px,4vw,25px)]'>
            {dictionary.iHaveAnAccount?.value}
          </span>
          <Button onClick={handleLogin} text={dictionary.login?.value} />

          <span className='font-poppins-light text-[clamp(20px,4vw,25px)] mt-[40px]'>
            {dictionary.iDontHaveAnAccount?.value}
          </span>
          <Button onClick={handleRegister} text={dictionary.register?.value} />
        </div>
      </article>
    </Modal>
  )
}
