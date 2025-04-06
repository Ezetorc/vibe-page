import { useNavigate } from 'react-router'
import { Button } from '../../../components/Button'
import { Nav } from '../../../components/Nav'
import { Section } from '../../../components/Section'
import { useSettings } from '../../../hooks/useSettings'
import { SettingsSection } from './SettingsSection'
import { SettingsButton } from './SettingsButton'
import { PATHS } from '../../../constants/PATHS'

export default function Settings () {
  const navigate = useNavigate()
  const { dictionary } = useSettings()

  return (
    <Section>
      <SettingsSection name={dictionary.account}>
        <SettingsButton modal='name' needsSession>
          {dictionary.changeName}
        </SettingsButton>

        <SettingsButton modal='description' needsSession>
          {dictionary.changeDescription}
        </SettingsButton>

        <SettingsButton modal='email' needsSession>
          {dictionary.changeEmail}
        </SettingsButton>

        <SettingsButton modal='password' needsSession>
          {dictionary.changePassword}
        </SettingsButton>

        <SettingsButton modal='logout' needsSession>
          {dictionary.logout}
        </SettingsButton>

        <SettingsButton modal='deleteAccount' needsSession dangerous>
          {dictionary.deleteAccount}
        </SettingsButton>
      </SettingsSection>

      <SettingsSection name={dictionary.display}>
        <SettingsButton modal='language'>
          {dictionary.changeLanguage}
        </SettingsButton>
      </SettingsSection>

      <SettingsSection name={dictionary.policy}>
        <Button
          text={dictionary.seeTerms}
          onClick={() => navigate(PATHS.termsSection)}
        />
      </SettingsSection>

      <Nav />
    </Section>
  )
}
