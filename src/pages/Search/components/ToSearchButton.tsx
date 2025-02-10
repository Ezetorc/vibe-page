import clsx from "clsx";
import { ToSearchButtonProps } from "../models/ToSearchButtonProps";

export function ToSearchButton ({ text, toSearch, type, onClick}: ToSearchButtonProps) {


  return (
    <button
      className={`${clsx([
        {
          'border-b-orange-crayola text-orange-crayola': toSearch === type
        },
        {
          'border-b-caribbean-current text-verdigris': toSearch !== type
        }
      ])} font-poppins-semibold border-b-vibe `}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
