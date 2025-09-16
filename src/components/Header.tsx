import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { Heart, ShoppingBag, LogOut, LogIn } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { useState, useEffect } from 'react';
import { AuthModal } from '../features/auth/AuthModal';

interface HeaderProps {
  session: Session | null;
}

export const Header = ({ session }: HeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (session) {
      setIsModalOpen(false);
    }
  }, [session]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <nav className="inline-flex border-b w-full">
        <div className="flex justify-between items-center max-sm:w-full">
          <Link to="/" className="lg:py-4.5 lg:px-6 py-2.5 px-4">
            <img
              className="w-22.5 h-7 inline object-contain"
              src="/src/img/header/Nice-Gadgets-with-smile.png"
              alt=""
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
              <Link to="/favorites">
                <Heart className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="border-l lg:has-[>svg]:px-6 lg:py-8 sm:has-[svg]:px-4 sm:py-6"
            >
              <Link to="/cart">
                <ShoppingBag className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>
      <AuthModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        supabaseClient={supabase}
      />
    </>
  );
};
