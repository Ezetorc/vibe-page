import { useCallback, useEffect, useState } from 'react'
import { PATHS } from '../../../constants/PATHS'
import { useSettings } from '../../../hooks/useSettings'

export function useTermsContent () {
  const { language } = useSettings()
  const [content, setContent] = useState<string | null>(null)

  const loadContent = useCallback(async () => {
    const fileName = PATHS.termsFile(language)
    const response = await fetch(fileName)
    const text = await response.text()
    setContent(text)
  }, [language])

  useEffect(() => {
    loadContent()
  }, [loadContent])

  return { content }
}
