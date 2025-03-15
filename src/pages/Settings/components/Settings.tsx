import { useNavigate } from 'react-router'
import { Button } from '../../../components/Button'
import { Nav } from '../../../components/Nav'
import { Section } from '../../../components/Section'
import { useSettings } from '../../../hooks/useSettings'
import { useUser } from '../../../hooks/useUser'
import { SettingsSection } from './SettingsSection'

export default function Settings () {
  const navigate = useNavigate()
  const { isSessionActive } = useUser()
  const { openModal, dictionary } = useSettings()

  const handleChangeEmail = () => {
    if (!isSessionActive()) {
      openModal('session')
      return
    }

    openModal('email')
  }

  const handleChangePassword = () => {
    if (!isSessionActive()) {
      openModal('session')
      return
    }

    openModal('password')
  }

  const handleChangeLanguage = () => {
    openModal('language')
  }

  const handleLogout = () => {
    if (!isSessionActive()) {
      openModal('session')
      return
    }

    openModal('logout')
  }

  const handleDeleteAccount = () => {
    if (!isSessionActive()) {
      openModal('session')
      return
    }

    openModal('deleteAccount')
  }

  const handleSeeTerms = () => {
    navigate('/terms')
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
        <Button text={`${dictionary.logout}`} onClick={handleLogout} />
        <Button
          classname='bg-red-500'
          text={`${dictionary.deleteAccount}`}
          onClick={handleDeleteAccount}
        />
      </SettingsSection>

      <SettingsSection name={dictionary.display}>
        <Button
          text={`${dictionary.change} ${dictionary.language}`}
          onClick={handleChangeLanguage}
        />
      </SettingsSection>

      <SettingsSection name={dictionary.policy}>
        <Button text={`${dictionary.seeTerms}`} onClick={handleSeeTerms} />
      </SettingsSection>

      <Nav />
    </Section>
  )
}
