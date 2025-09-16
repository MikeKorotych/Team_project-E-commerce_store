import { Outlet } from 'react-router';
import { Header } from './components/Header';

import Footer from './components/Fotter';
import ScrollToTop from './components/ScrollToTop';

import { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';
import type { Session } from '@supabase/supabase-js';


function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div>
      <ScrollToTop />
      <Header session={session} />
      <div className="mx-auto max-w-[1200px] min-[1200px]:px-[32px] px-4 sm:px-8 py-6">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
