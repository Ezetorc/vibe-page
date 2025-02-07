import { FormInputProps } from '../models/FormInputProps'

export function FormInput ({ min, className, max, reference, placeholder, type = 'text' }: FormInputProps) {
  return (
    <input
      ref={reference}
      type={type}
      minLength={min}
      maxLength={max}
      required
      placeholder={placeholder}
      className={`${className} outline-none text-[clamp(20px,3vw,25px)] focus:border-b-orange-crayola placeholder:font-poppins-regular placeholder:text-caribbean-current border-b-verdigris bg-transparent border-b-2 w-full h-[clamp(40px,30%,60px)]`}
    ></input>
  )
}
