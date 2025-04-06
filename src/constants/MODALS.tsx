import { CommentModal } from '../components/Comments/CommentModal'
import { ConnectionModal } from '../components/ConnectionModal'
import { SessionModal } from '../components/SessionModal'
import { ModalName } from '../models/ModalName'
import { ChangePictureModal } from '../pages/Account/components/ChangePictureModal'
import { CropImageModal } from '../pages/Account/components/CropImageModal'
import { InvalidEditModal } from '../pages/Account/components/InvalidEditModal'
import { ChangeDescriptionModal } from '../pages/Settings/components/ChangeDescriptionModal'
import { ChangeEmailModal } from '../pages/Settings/components/ChangeEmailModal'
import { ChangeLanguageModal } from '../pages/Settings/components/ChangeLanguageModal'
import { ChangeNameModal } from '../pages/Settings/components/ChangeNameModal'
import { ChangePasswordModal } from '../pages/Settings/components/ChangePasswordModal'
import { DeleteAccountModal } from '../pages/Settings/components/DeleteAccountModal'
import { LogoutModal } from '../pages/Settings/components/LogoutModal'

export const MODALS: { [key in ModalName]: JSX.Element } = {
  session: <SessionModal />,
  language: <ChangeLanguageModal />,
  email: <ChangeEmailModal />,
  edit: <InvalidEditModal />,
  connection: <ConnectionModal />,
  password: <ChangePasswordModal />,
  comment: <CommentModal />,
  logout: <LogoutModal />,
  deleteAccount: <DeleteAccountModal />,
  picture: <ChangePictureModal />,
  crop: <CropImageModal />,
  name: <ChangeNameModal />,
  description: <ChangeDescriptionModal />
}
