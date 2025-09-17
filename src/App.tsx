import { Outlet } from 'react-router';
import { Header } from './components/Header';

import Footer from './components/Fotter';

import { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';
import type { Session } from '@supabase/supabase-js';
import { useCartStore } from './features/cart/cartStore';
import { useFavoritesStore } from './features/favourites/favoritesStore';
import { Toaster } from './components/ui/sonner';

function App() {
  const [session, setSession] = useState<Session | null>(null);

  const { fetchCart } = useCartStore();
  const { fetchFavorites } = useFavoritesStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    fetchCart(); // Fetch cart on initial load
    fetchFavorites(); // Fetch favorites on initial load

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      fetchCart(); // Also fetch cart on auth state change (login/logout)
      fetchFavorites(); // Also fetch favorites on auth state change
    });

    return () => subscription.unsubscribe();
  }, [fetchCart, fetchFavorites]);

  return (
    <div>
      <Header session={session} />
      {/* <Toaster richColors /> */}
      <Toaster richColors position="top-center" />
      <div className="mx-auto max-w-[1200px] min-[1200px]:px-[32px] px-4 sm:px-8 py-6">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
