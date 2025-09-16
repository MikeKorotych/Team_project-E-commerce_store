import { Outlet } from 'react-router';
import { Header } from './components/Header';

import Footer from './components/Fotter';

import { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';
import type { Session } from '@supabase/supabase-js';
import { useCartStore } from './features/cart/cartStore';

function App() {
  const [session, setSession] = useState<Session | null>(null);

  const { fetchCart } = useCartStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    fetchCart(); // Fetch cart on initial load

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      fetchCart(); // Also fetch cart on auth state change (login/logout)
    });

    return () => subscription.unsubscribe();
  }, [fetchCart]);

  return (
    <div>
      <Header session={session} />
      <div className="mx-auto max-w-[1200px] min-[1200px]:px-[32px] px-4 sm:px-8 py-6">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
