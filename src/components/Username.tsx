import { Link } from "react-router";
import { UsernameProps } from "../models/UsernameProps";

export function Username ({ username}: UsernameProps) {
  return (
    <Link
      className='text-orange-crayola hover:underline font-poppins-regular content-end text-[clamp(20px,7vw,25px)]'
      to={`/account/${username}`}
    >
      {username}
    </Link>
  )
}
