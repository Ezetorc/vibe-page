import { FormInputProps } from '../models/Props/FormInputProps'

export function FormInput (props: FormInputProps) {
  return (
    <input
      onChange={props.onChange}
      ref={props.reference}
      type={props.type}
      minLength={props.min}
      maxLength={props.max}
      required
      name={props.name}
      value={props.value}
      placeholder={props.placeholder}
      className={`${props.className} outline-hidden text-[clamp(20px,3vw,25px)] focus:border-b-orange-crayola placeholder:font-poppins-regular placeholder:text-caribbean-current border-b-verdigris bg-transparent border-b-2 w-full h-[clamp(40px,30%,60px)]`}
    ></input>
  )
}
