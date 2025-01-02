import { Link, useLocation } from 'react-router';
import { NavButtonProps } from '../../../models/NavButtonProps';

export function NavButton({ icon, to }: NavButtonProps) {
  const location = useLocation(); 

  return (
    <Link to={to}>
      {<icon.type filled={location.pathname === to} />}
    </Link>
  );
}
