import { Link } from 'wouter'
import { PATHS } from '../../../constants/PATHS'
import { ChangeEvent } from 'react'
import { RegisterData } from '../models/RegisterData'
import { useSettings } from '../../../hooks/useSettings'

export function TermsInput (props: {
  data: RegisterData
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  const { dictionary } = useSettings()

  return (
    <div className='flex gap-x-5 items-center'>
      <input
        name='agreeWithTerms'
        type='checkbox'
        id='agree-with-terms'
        checked={props.data.agreeWithTerms}
        onChange={props.onChange}
        className='peer hidden'
      />
      <label
        htmlFor='agree-with-terms'
        className='relative w-6 h-6 flex items-center justify-center border-2 border-white rounded-full cursor-pointer peer-checked:bg-orange-crayola peer-checked:border-orange-crayola'
      >
        <span className='absolute w-3 h-3 bg-white rounded-full opacity-0 scale-0 peer-checked:opacity-100 peer-checked:scale-100'></span>
      </label>
      <label className='font-poppins-light' htmlFor='agree-with-terms'>
        {dictionary.iAgreeWith}{' '}
        <Link
          to={PATHS.termsSection}
          className='border-b-2 border-b-white hover:border-b-orange-crayola hover:text-orange-crayola'
        >
          {dictionary.termsAndConditions}
        </Link>
      </label>
    </div>
  )
}
