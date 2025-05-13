import { useState } from 'react'
import { Button } from '../../../components/Button'
import { FormInput } from '../../../components/FormInput'
import { Modal } from '../../../components/Modal'
import { useSettings } from '../../../hooks/useSettings'
import { CloseModalButton } from '../../../components/CloseModalButton'
import { ErrorMessage } from '../../../components/ErrorMessage'
import { useNameChanger } from '../hooks/useNameChanger'
import { useSession } from '../../../hooks/useSession'

export default function ChangeNameModal () {
  const { dictionary } = useSettings()
  const { loggedUser } = useSession()
  const [newName, setNewName] = useState<string>('')
  const { error, isLoading, changeName } = useNameChanger(newName)

  return (
    <Modal>
      <article className='items-center p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(200px,auto,600px)]'>
        <CloseModalButton />

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.changeName}
        </h2>

        <FormInput
          type='text'
          min={3}
          max={20}
          onChange={event => setNewName(event.currentTarget.value)}
          placeholder={loggedUser?.name ?? ''}
          className='placeholder:text-verdigris p-[5px]'
        />

        <ErrorMessage value={error} />

        <Button
          classname='w-full'
          loading={isLoading}
          text={dictionary.change}
          onClick={changeName}
        />
      </article>
    </Modal>
  )
}
