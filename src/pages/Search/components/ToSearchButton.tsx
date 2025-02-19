import clsx from "clsx";
import { ToSearchButtonProps } from "../models/ToSearchButtonProps";

export function ToSearchButton (props: ToSearchButtonProps) {


  return (
    <button
      className={`${clsx([
        {
          'border-b-orange-crayola text-orange-crayola': props.toSearch === props.type
        },
        {
          'border-b-caribbean-current text-verdigris': props.toSearch !== props.type
        }
      ])} font-poppins-semibold border-b-vibe cursor-pointer`}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  )
}
