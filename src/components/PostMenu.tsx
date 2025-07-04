import { DotsIcon } from './Icons'
import { useSettings } from '../hooks/useSettings'
import { Content, Item, Root, Trigger } from '@radix-ui/react-dropdown-menu'

export function PostMenu (props: { onDelete: () => void }) {
  const { dictionary } = useSettings()

  return (
    <Root>
      <Trigger
        title='Post Menu'
        className='desktop:p-2 mobile:p-1 cursor-pointer rounded-vibe hover:bg-gray-700'
      >
        <DotsIcon />
      </Trigger>

      <Content className='absolute right-[-40px] mt-2 w-40 bg-gunmetal border-vibe rounded-vibe border-caribbean-current text-white shadow-lg'>
        <Item
          className='px-4 py-2 cursor-pointer desktop:hover:bg-gray-700'
          onClick={props.onDelete}
        >
          {dictionary.delete}
        </Item>
      </Content>
    </Root>
  )
}
