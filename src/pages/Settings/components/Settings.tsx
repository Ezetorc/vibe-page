import { Button } from '../../../components/Button'
import { Nav } from '../../../components/Nav'
import { Section } from '../../../components/Section'
import { useSettings } from '../../../hooks/useSettings'
import { useUser } from '../../../hooks/useUser'
import { SettingsSection } from './SettingsSection'

export default function Settings () {
  const { isSessionActive } = useUser()
  const { setVisibleModal, dictionary } = useSettings()

  const handleChangeEmail = () => {
    if (!isSessionActive()) {
      setVisibleModal({ name: 'session' })
      return
    }

    setVisibleModal({ name: 'email' })
  }

  const handleChangePassword = () => {}

  const handleChangeLanguage = () => {
    setVisibleModal({ name: 'language' })
  }

  return (
    <Section>
      <SettingsSection name={dictionary.account}>
        <Button
          text={`${dictionary.change} ${dictionary.password}`}
          onClick={handleChangePassword}
        />
        <Button
          text={`${dictionary.change} ${dictionary.email}`}
          onClick={handleChangeEmail}
        />
      </SettingsSection>

      <SettingsSection name={dictionary.display}>
        <Button
          text={`${dictionary.change} ${dictionary.language}`}
          onClick={handleChangeLanguage}
        />
      </SettingsSection>

      <Nav />
    </Section>
  )
}
