import { Outlet } from 'react-router';
import { Header } from './components/Header';
import { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';
import type { Session } from '@supabase/supabase-js';

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div>
      <Header session={session} />
      <div className="mx-auto max-w-[1200px] min-[1200px]:px-[32px] px-4 sm:px-8 py-6">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
