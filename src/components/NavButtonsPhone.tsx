import classNames from "classnames";
import type { Session } from "@supabase/supabase-js";
// import type { RefObject } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { Heart, LogIn, LogOut, ShoppingBag } from "lucide-react";

type Props = {
  session: Session | null;
  isBurgerOpen: boolean;
  setBurgerOpen: (value: boolean) => void;
  totalItems: number;
  handleSignOut: () => Promise<void>;
  setIsModalOpen: (value: boolean) => void;
};

export const NavButtonsPhone: React.FC<Props> = ({
  session,
  isBurgerOpen,
  setBurgerOpen,
  totalItems,
  handleSignOut,
  setIsModalOpen,
}) => {
  return (
    <div
      className={classNames(
        "bg-background border-t fixed w-full h-[calc(100vh-3rem)] right-0 left-0 top-12 flex flex-col justify-between z-70 overflow-hidden transition-[max-height] duration-300 ease-in-out",
        { "max-h-0": !isBurgerOpen, "max-h-screen": isBurgerOpen }
      )}
    >
      <div className="flex flex-col items-center mt-4 space-y-2">
        <Button
          asChild
          variant={"ghost"}
          className="text-xs text-dark lg:p-8 sm:p-6"
          onClick={() => setBurgerOpen(false)}
        >
          <Link to="/">HOME</Link>
        </Button>
        <Button
          asChild
          variant={"ghost"}
          className="text-xs text-dark lg:p-8 sm:p-6"
          onClick={() => setBurgerOpen(false)}
        >
          <Link to="/phones">PHONES</Link>
        </Button>
        <Button
          asChild
          variant={"ghost"}
          className="text-xs text-dark lg:p-8 sm:p-6"
          onClick={() => setBurgerOpen(false)}
        >
          <Link to="/tablets">TABLETS</Link>
        </Button>
        <Button
          asChild
          variant={"ghost"}
          className="text-xs text-dark lg:p-8 sm:p-6"
          onClick={() => setBurgerOpen(false)}
        >
          <Link to="/accessories">ACCESSORIES</Link>
        </Button>
      </div>
      <div className="flex w-full justify-around items-center">
        {session ? (
          <div className="flex-1 border pl-4 flex items-center justify-center gap-2">
            <Button onClick={handleSignOut} variant="ghost">
              <span>{session.user?.email?.[0].toUpperCase()}</span>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => {
              setIsModalOpen(true);
              setBurgerOpen(false);
            }}
            variant="ghost"
            className="flex-1 border w-auto lg:has-[>svg]:px-6 lg:py-8 sm:has-[svg]:px-4 sm:py-6"
          >
            <LogIn className="w-4 h-4" />
          </Button>
        )}
        <Button
          asChild
          variant="ghost"
          className="flex-1 border w-auto lg:has-[>svg]:px-6 lg:py-8 sm:has-[svg]:px-4 sm:py-6"
          onClick={() => setBurgerOpen(false)}
        >
          <Link to="/favourites">
            <Heart className="w-4 h-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="flex-1 border w-auto lg:has-[>svg]:px-6 lg:py-8 sm:has-[svg]:px-4 sm:py-6"
          onClick={() => setBurgerOpen(false)}
        >
          <Link to="/cart" className="relative">
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <div className="flex rounded-full bg-red-400 top-3 right-3 items-center justify-center text-sm h-4.5 w-4.5">
                <div className="mt-0.5">{totalItems}</div>
              </div>
            )}
          </Link>
        </Button>
      </div>
    </div>
  );
};
