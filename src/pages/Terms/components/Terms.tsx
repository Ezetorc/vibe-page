import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useSettings } from '../../../hooks/useSettings'
import { Section } from '../../../components/Section'
import { Nav } from '../../../components/Nav'

export default function MarkdownRenderer () {
  const { language } = useSettings()
  const [content, setContent] = useState('')

  useEffect(() => {
    const fileName = `/${language}_TERMS.md`

    fetch(fileName)
      .then(res => res.text())
      .then(text => setContent(text))
  }, [language])

  return (
    <Section>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>

      <Nav />
    </Section>
  )
}
