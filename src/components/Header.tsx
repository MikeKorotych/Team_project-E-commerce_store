import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

import { Heart, ShoppingBag, LogOut, LogIn } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { useState, useEffect, RefObject } from 'react';
import { AuthModal } from '../features/auth/AuthModal';
import { toast } from 'sonner';
import { useCartStore } from '@/features/cart/cartStore';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const imgFromSupabase = `${supabaseUrl}/storage/v1/object/public/product-images/img/header/Nice-Gadgets-with-smile.png`;

interface Props {
  session: Session | null;
  cartIconRef: RefObject<HTMLAnchorElement>; // Add ref to props
}

export const Header = ({ session, cartIconRef }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { items } = useCartStore();

  const totalItems = items.reduce((acc, cur) => acc + cur.quantity, 0);

  useEffect(() => {
    if (session) {
      setIsModalOpen(false);
    }
  }, [session]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast('You have been signed out');
  };

  return (
    <>
      <nav className="inline-flex border-b w-full sticky top-0 z-50 bg-background/80 shadow-2xl backdrop-blur-sm">
        <div className="flex justify-between items-center max-sm:w-full">
          <Link to="/" className="lg:py-4.5 lg:px-6 py-2.5 px-4">
            <img
              className="w-22.5 h-7 inline object-contain"
              src={imgFromSupabase}
              alt="header logo"
            />
          </Link>
          {/* burger for small screens */}
          <Button
            variant="link"
            className="sm:hidden flex flex-col gap-1 py-3 px-4 h-12 w-12"
          >
            <span className="h-0.5 w-4 bg-white"></span>
            <span className="h-0.5 w-4 bg-white"></span>
            <span className="h-0.5 w-4 bg-white"></span>
          </Button>
        </div>
        <div className="justify-between hidden sm:inline-flex w-full">
          <div className="flex items-center">
            <Button asChild variant={'ghost'} className="text-xs lg:p-8 sm:p-6">
              <Link to="/">HOME</Link>
            </Button>
            <Button asChild variant={'ghost'} className="text-xs lg:p-8 sm:p-6">
              <Link to="/phones">PHONES</Link>
            </Button>
            <Button asChild variant={'ghost'} className="text-xs lg:p-8 sm:p-6">
              <Link to="/tablets">TABLETS</Link>
            </Button>
            <Button asChild variant={'ghost'} className="text-xs lg:p-8 sm:p-6">
              <Link to="/accessories">ACCESSORIES</Link>
            </Button>
          </div>
          <div className="flex items-center justify-center">
            {session ? (
              <div className="border-l pl-4 ml-4 flex items-center gap-2">
                <span>{session.user?.email?.[0].toUpperCase()}</span>
                <Button onClick={handleSignOut} variant="ghost">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="ghost"
                className="border-l lg:has-[>svg]:px-6 lg:py-8 sm:has-[svg]:px-4 sm:py-6"
              >
                <LogIn className="w-4 h-4" />
              </Button>
            )}
            <Button
              asChild
              variant="ghost"
              className="border-l lg:has-[>svg]:px-6 lg:py-8 sm:has-[svg]:px-4 sm:py-6"
            >
              <Link to="/favourites">
                <Heart className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="border-l lg:has-[>svg]:px-6 lg:py-8 sm:has-[svg]:px-4 sm:py-6"
            >
              <Link to="/cart" className="relative" ref={cartIconRef}>
                <ShoppingBag className="w-4 h-4" />
                {totalItems > 0 && (
                  <div className="absolute rounded-full bg-red-400 top-3 right-3 flex items-center justify-center text-sm h-4.5 w-4.5">
                    <div className="mt-0.5">{totalItems}</div>
                  </div>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </nav>
      <AuthModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};
