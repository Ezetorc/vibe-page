import { useState } from 'react'
import { Button } from '../../../components/Button'
import { Modal } from '../../../components/Modal'
import { Select } from '../../../components/Select'
import { useSettings } from '../../../hooks/useSettings'
import { Language } from '../../../models/Language'
import { CloseModalButton } from '../../../components/CloseModalButton'
import { Languages } from './Languages'

export function ChangeLanguageModal () {
  const { setVisibleModal, language, setLanguage, dictionary } = useSettings()
  const [newLanguage, setNewLanguage] = useState<Language>(language)

  const handleClose = () => {
    setVisibleModal({ name: null })
  }

  const handleChangeNewLanguage = async (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    const newLanguage: Language = event.currentTarget.value as Language
    setNewLanguage(newLanguage)
  }

  const handleChangeLanguage = () => {
    setLanguage(newLanguage)

    localStorage.setItem('language', newLanguage)
    handleClose()
  }

  return (
    <Modal>
      <article className='items-center p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(200px,auto,600px)]'>
        <CloseModalButton onClose={handleClose} />

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.change} {dictionary.language}
        </h2>

        <Select onInput={handleChangeNewLanguage} defaultValue={language}>
          <Languages />
        </Select>

        <Button text={dictionary.change} onClick={handleChangeLanguage} />
      </article>
    </Modal>
  )
}
