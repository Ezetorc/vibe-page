import clsx from 'clsx'
import { useSettings } from '../../../hooks/useSettings'
import { MouseEventHandler } from 'react'
import { ToSearch } from '../models/ToSearch'

export function ToSearchButton (props: {
  onClick: MouseEventHandler<HTMLButtonElement>
  type: ToSearch
  toSearch: ToSearch
}) {
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
