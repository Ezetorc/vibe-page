import { ModalName } from '../models/ModalName'

export const MODALS: {
  [key in ModalName]: () => Promise<{ default: React.ComponentType }>
} = {
  session: () => import('../components/SessionModal'),
  language: () => import('../pages/Settings/components/ChangeLanguageModal'),
  email: () => import('../pages/Settings/components/ChangeEmailModal'),
  edit: () => import('../pages/Account/components/InvalidEditModal'),
  connection: () => import('../components/ConnectionModal'),
  password: () => import('../pages/Settings/components/ChangePasswordModal'),
  comment: () => import('../components/CommentModal'),
  logout: () => import('../pages/Settings/components/LogoutModal'),
  deleteAccount: () => import('../pages/Settings/components/DeleteAccountModal'),
  picture: () => import('../pages/Account/components/ChangePictureModal'),
  crop: () => import('../pages/Account/components/CropImageModal'),
  name: () => import('../pages/Settings/components/ChangeNameModal'),
  description: () => import('../pages/Settings/components/ChangeDescriptionModal')
}
