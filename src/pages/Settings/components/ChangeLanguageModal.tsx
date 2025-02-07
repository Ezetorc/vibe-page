import { useState } from 'react'
import { Button } from '../../../components/Button'
import { Modal } from '../../../components/Modal'
import { Select } from '../../../components/Select'
import { useSettings } from '../../../hooks/useSettings'
import { Language } from '../../../models/Language'

export function ChangeLanguageModal () {
  const { setChangeLanguageModalVisible, language, setLanguage, dictionary } = useSettings()
  const [newLanguage, setNewLanguage] = useState<Language>(language)

  const handleClose = () => {
    setChangeLanguageModalVisible(false)
  }

  const handleChangeNewLanguage = async (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    const newLanguage: Language = event.currentTarget.value as Language
    setNewLanguage(newLanguage)
  }

  const handleChangeLanguage = () => {
    setLanguage(newLanguage)
    handleClose()
  }

  return (
    <Modal>
      <article className='items-center p-[clamp(10px,5%,20px)] relative gap-y-[clamp(20px,50%,40px)] flex flex-col rounded-vibe bg-caribbean-current w-[clamp(300px,70%,1000px)] h-[clamp(200px,auto,600px)]'>
        <button
          onClick={handleClose}
          className='absolute top-0 right-0 pr-[2%] pt-[1%] font-poppins-semibold text-[clamp(15px,4vw,20px)]'
        >
          X
        </button>

        <h2 className='text-center font-poppins-semibold text-[clamp(20px,7vw,60px)] bg-clip-text text-transparent bg-orange-gradient'>
          {dictionary.change?.value} {dictionary.language?.value}
        </h2>

        <Select onInput={handleChangeNewLanguage} defaultValue={language}>
          <option value='en'>English</option>
          <option value='es'>Español</option>
        </Select>

        <Button text={dictionary.change?.value} onClick={handleChangeLanguage} />
      </article>
    </Modal>
  )
}
