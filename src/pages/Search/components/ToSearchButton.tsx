import clsx from 'clsx'
import { ToSearchButtonProps } from '../models/ToSearchButtonProps'
import { useSettings } from '../../../hooks/useSettings'

export function ToSearchButton (props: ToSearchButtonProps) {
  const { dictionary } = useSettings()

  return (
    <button
      data-type={props.type}
      className={`${clsx([
        {
          'border-b-orange-crayola text-orange-crayola':
            props.toSearch === props.type
        },
        {
          'border-b-caribbean-current text-verdigris':
            props.toSearch !== props.type
        }
      ])} font-poppins-semibold border-b-vibe cursor-pointer`}
      onClick={props.onClick}
    >
      {dictionary[props.type]}
    </button>
  )
}
