import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { DotsIcon } from './Icons'
import { useSettings } from '../hooks/useSettings'

export function PostMenu ({ onDelete }: { onDelete: () => void }) {
  const { dictionary } = useSettings()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className='p-2 m-[5px] rounded-vibe hover:bg-gray-700'>
        <DotsIcon />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className='absolute left-0 mt-2 w-40 bg-gunmetal border-vibe rounded-vibe border-caribbean-current text-white shadow-lg'>
        <DropdownMenu.Item
          className='px-4 py-2 cursor-pointer hover:bg-gray-700'
          onClick={onDelete}
        >
          {dictionary.delete?.value}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
