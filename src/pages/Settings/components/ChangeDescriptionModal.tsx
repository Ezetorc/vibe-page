import { useState } from 'react'
import { Button } from '../../../components/Button'
import { FormInput } from '../../../components/FormInput'
import { Modal } from '../../../components/Modal'
import { useSettings } from '../../../hooks/useSettings'
import { CloseModalButton } from '../../../components/CloseModalButton'
import { ErrorMessage } from '../../../components/ErrorMessage'
import { useDescriptionChanger } from '../hooks/useDescriptionChanger'

export default function ChangeDescriptionModal () {
  const { dictionary } = useSettings()
  const [newDescription, setNewDescription] = useState<string>('')
  const { error, isLoading, changeDescription } =
    useDescriptionChanger(newDescription)

  return (
    <Modal>
      <article className='items-center p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(200px,auto,600px)]'>
        <CloseModalButton />

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.changeDescription}
        </h2>

        <FormInput
          type='text'
          onChange={event => setNewDescription(event.currentTarget.value)}
          min={0}
          max={200}
          placeholder={dictionary.leaveBlankToRemove}
          className='placeholder:text-verdigris p-[5px]'
        />

        <ErrorMessage value={error} />

        <Button
          classname='w-full'
          loading={isLoading}
          text={dictionary.change}
          onClick={changeDescription}
        />
      </article>
    </Modal>
  )
}
