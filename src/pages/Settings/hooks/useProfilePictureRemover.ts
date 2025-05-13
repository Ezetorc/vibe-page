import { useSession } from '../../../hooks/useSession'
import { useSettings } from '../../../hooks/useSettings'

export function useProfilePictureRemover () {
  const { loggedUser, setLoggedUser, isSessionActive } = useSession()
  const { openModal, closeModal } = useSettings()

  const removeImage = async () => {
    if (!isSessionActive) {
      openModal('session')
      return
    }

    await loggedUser!.saveImage(null, null)

    const newLoggedUser = loggedUser!.update({
      imageId: undefined,
      imageUrl: undefined
    })

    setLoggedUser(newLoggedUser)
    closeModal()
  }

  return removeImage
}
