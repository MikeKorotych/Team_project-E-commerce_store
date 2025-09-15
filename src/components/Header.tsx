import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

export const Navbar = () => (
  <div className="grid grid-cols-4 gap-4 p-4 border-b mb-4">
    <Button variant={'ghost'}>
      <Link to="/home">HOME</Link>
    </Button>
    <Button variant={'ghost'}>
      <Link to="/phones">PHONES</Link>
    </Button>
    <Button variant={'ghost'}>
      <Link to="/tables">TABLETS</Link>
    </Button>
    <Button variant={'ghost'}>
      <Link to="/accessories">ACCESSORIES</Link>
    </Button>
  </div>
);
