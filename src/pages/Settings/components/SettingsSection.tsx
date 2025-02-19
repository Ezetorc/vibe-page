import { SettingsSectionProps } from '../models/SettingsSectionProps'

export function SettingsSection (props: SettingsSectionProps) {
  return (
    <fieldset className='w-full flex flex-col gap-y-[20px] border-caribbean-current border-vibe rounded-vibe p-4'>
      <legend className='ml-[5%] px-[1%] font-poppins-regular text-[clamp(10px,2rem,22px)]'>
        {props.name}
      </legend>

      {props.children}
    </fieldset>
  )
}
