import { Nav } from '../../../components/Nav'
import { Section } from '../../../components/Section'
import { PostCreator } from './PostCreator'
import { PostOwner } from './PostOwner'

export default function Create () {
  return (
    <Section className='grid grid-rows-[1fr,6fr,1fr] h-screen'>
      <PostOwner />
      <PostCreator />
      <Nav />
    </Section>
  )
}
