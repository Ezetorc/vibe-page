import { lazy, Suspense } from 'react'
import { MODALS } from '../constants/MODALS'
import { useSettings } from '../hooks/useSettings'

export function ModalRenderer () {
  const { activeModal } = useSettings()
  const LazyModal = activeModal.name && lazy(MODALS[activeModal.name])

  return (
    <>
      {LazyModal && (
        <Suspense fallback={null}>
          <LazyModal />
        </Suspense>
      )}
    </>
  )
}
