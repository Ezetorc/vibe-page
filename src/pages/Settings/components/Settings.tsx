import { Button } from '../../../components/Button'
import { Nav } from '../../../components/Nav'
import { Section } from '../../../components/Section'
import { useSettings } from '../../../hooks/useSettings'
import { useUser } from '../../../hooks/useUser'
import { SettingsSection } from './SettingsSection'

export default function Settings () {
  const { isSessionActive } = useUser()
  const {
    setSessionModalVisible,
    setChangeEmailModalVisible,
    setChangeLanguageModalVisible,
    dictionary
  } = useSettings()

  const handleChangeEmail = () => {
    if (!isSessionActive()) {
      setSessionModalVisible(true)
      return
    }

    setChangeEmailModalVisible(true)
  }

  const handleChangePassword = () => {}

  const handleChangeLanguage = () => {
    setChangeLanguageModalVisible(true)
  }

  return (
    <Section>
      <SettingsSection name={dictionary.account?.value}>
        <Button
          text={`${dictionary.change?.value} ${dictionary.password?.value}`}
          onClick={handleChangePassword}
        />
        <Button
          text={`${dictionary.change?.value} ${dictionary.email?.value}`}
          onClick={handleChangeEmail}
        />
      </SettingsSection>

      <SettingsSection name={dictionary.display?.value}>
        <Button
          text={`${dictionary.change?.value} ${dictionary.language?.value}`}
          onClick={handleChangeLanguage}
        />
      </SettingsSection>

      <Nav />
    </Section>
  )
}
