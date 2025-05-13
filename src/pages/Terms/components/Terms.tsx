import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Section } from '../../../components/Section'
import { useTermsContent } from '../hooks/useTermsContent'

export default function Terms () {
  const { content } = useTermsContent()

  return (
    <Section>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </Section>
  )
}
