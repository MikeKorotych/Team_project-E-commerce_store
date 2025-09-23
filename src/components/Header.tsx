import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Heart, LogIn, ShoppingBag, X } from "lucide-react";
import { useAuthStore } from "../features/auth/sessionStore";
import { useState, useEffect } from "react";
import { AuthModal } from "../features/auth/AuthModal";
import { useCartStore } from "@/features/cart/cartStore";
import { NavButtonsPhone } from "./NavButtonsPhone";
import { useFavoritesStore } from "@/features/favourites/favoritesStore";
import { SearchDropdown } from "./SearchDropdown";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const imgFromSupabase = `${supabaseUrl}/storage/v1/object/public/product-images/img/header/Nice-Gadgets-with-smile.png`;

export const Header = () => {
  const { session, cartIconRef, initialize } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { items } = useCartStore();
  const { favorites } = useFavoritesStore();

  const [isBurgerOpen, setBurgerOpen] = useState(false);

  const totalItems = items.reduce((acc, cur) => acc + cur.quantity, 0);
  const totalFavorites = favorites.length;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast("You have been signed out");
  };

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe?.();
  }, [initialize]);

  useEffect(() => {
    if (session) {
      setIsModalOpen(false);
    }
  }, [session]);

  useEffect(() => {
    if (isBurgerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isBurgerOpen]);

  return (
    <>
      <nav className="flex items-center justify-between border-b w-full sticky top-0 z-50 bg-background/80 shadow-2xl backdrop-blur-sm">
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
            className="sm:hidden flex flex-col gap-1 py-3 px-4 h-12 w-12 border-l"
            onClick={() => setBurgerOpen(!isBurgerOpen)}
          >
            {isBurgerOpen ? (
              <X className="text-white" />
            ) : (
              <>
                <span className="h-0.5 w-4 bg-white"></span>
                <span className="h-0.5 w-4 bg-white"></span>
                <span className="h-0.5 w-4 bg-white"></span>
              </>
            )}
          </Button>
        </div>
        <div className="justify-between hidden sm:inline-flex w-full">
          <div className="flex items-center">
            <Button asChild variant={"ghost"} className="text-xs lg:p-8 sm:p-6">
              <Link to="/">HOME</Link>
            </Button>
            <Button asChild variant={"ghost"} className="text-xs lg:p-8 sm:p-6">
              <Link to="/phones">PHONES</Link>
            </Button>
            <Button asChild variant={"ghost"} className="text-xs lg:p-8 sm:p-6">
              <Link to="/tablets">TABLETS</Link>
            </Button>
            <Button asChild variant={"ghost"} className="text-xs lg:p-8 sm:p-6">
              <Link to="/accessories">ACCESSORIES</Link>
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <SearchDropdown />
            {session ? (
              <Button
                asChild
                variant="ghost"
                className="border-l px-7 lg:py-8 sm:has-[svg]:px-4 sm:py-6"
              >
                <Link to="/profile">
                  <span>{session.user?.email?.[0].toUpperCase()}</span>
                </Link>
              </Button>
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
              <Link to="/favourites" className="relative">
                <Heart className="w-4 h-4" />
                {totalFavorites > 0 && (
                  <div className="absolute rounded-full bg-red-400 top-3 right-3 flex items-center justify-center text-sm h-4.5 w-4.5">
                    <div className="mt-0.5">{totalFavorites}</div>
                  </div>
                )}
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
        <div className="sm:hidden">
          <NavButtonsPhone
            session={session}
            isBurgerOpen={isBurgerOpen}
            setBurgerOpen={setBurgerOpen}
            totalItems={totalItems}
            handleSignOut={handleSignOut}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      </nav>
      <AuthModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};
