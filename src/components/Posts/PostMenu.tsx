import { DotsIcon } from '../Icons'
import { useSettings } from '../../hooks/useSettings'
import { PostMenuProps } from '../../models/Props/PostMenuProps'
import { Content, Item, Root, Trigger } from '@radix-ui/react-dropdown-menu'

export function PostMenu (props: PostMenuProps) {
  const { dictionary } = useSettings()

  return (
    <Root>
      <Trigger title='Post Menu' className='p-2 m-[5px] cursor-pointer rounded-vibe hover:bg-gray-700'>
        <DotsIcon />
      </Trigger>

      <Content className='absolute left-0 mt-2 w-40 bg-gunmetal border-vibe rounded-vibe border-caribbean-current text-white shadow-lg'>
        <Item
          className='px-4 py-2 cursor-pointer hover:bg-gray-700'
          onClick={props.onDelete}
        >
          {dictionary.delete}
        </Item>
      </Content>
    </Root>
  )
}
