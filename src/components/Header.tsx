import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { ModeToggle } from './mode-toggle';
import { Heart, ShoppingBag } from 'lucide-react';

export const Header = () => (
  <nav className="inline-flex border-b w-full">
    <Link to="/" className=" py-4.5 px-6">
      <img
        className="w-22.5 h-7 inline object-cover"
        src="/src/img/header/Nice-Gadgets-with-smile.png"
        alt=""
      />
    </Link>
    <div className="justify-between inline-flex w-full">
      <div className="flex items-center ">
        <Button asChild variant={'ghost'} className="text-xs p-8">
          <Link to="/home">HOME</Link>
        </Button>
        <Button asChild variant={'ghost'} className="text-xs p-8">
          <Link to="/phones">PHONES</Link>
        </Button>
        <Button asChild variant={'ghost'} className="text-xs p-8">
          <Link to="/tables">TABLETS</Link>
        </Button>
        <Button asChild variant={'ghost'} className="text-xs p-8">
          <Link to="/accessories">ACCESSORIES</Link>
        </Button>
      </div>
      <div className="flex items-center justify-center">
        {/* <ModeToggle /> */}
        <Button
          asChild
          variant="ghost"
          className="border-l has-[>svg]:px-6 py-8"
        >
          <Link to="/favorites">
            <Heart className="w-4 h-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="border-l has-[>svg]:px-6 py-8"
        >
          <Link to="/cart">
            <ShoppingBag className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  </nav>
);
