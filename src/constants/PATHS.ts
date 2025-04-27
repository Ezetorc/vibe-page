import { Language } from '../models/Language'

export const PATHS = {
  guestImage: '/images/guest_user.webp',
  dictionaryFile: '/text/dictionary.csv',
  termsFile: (language: Language) => `/text/terms[${language}].md`,
  homeSection: '/',
  registerSection: '/register',
  loginSection: '/login',
  searchSection: '/search',
  createSection: '/create',
  accountIdSection: '/account/:userId',
  accountSection: '/account',
  settingsSection: '/settings',
  termsSection: '/terms',
  notificationsSection: '/notifications'
}
