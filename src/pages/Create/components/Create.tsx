import { Nav } from '../../../components/Nav'
import { Section } from '../../../components/Section'
import { PostCreator } from './PostCreator'
import { PostOwner } from './PostOwner'

export default function Create () {
  return (
    <Section className='flex flex-col h-screen'>
      <PostOwner />
      <PostCreator />
      <Nav />
    </Section>
  )
}
