import { create } from 'zustand';
import { supabase } from '@/utils/supabase';
import type { Session } from '@supabase/supabase-js';
// import type { Profile } from '@/types/Profile';

// Тип для профиля, который мы создали в базе данных
export interface Profile {
  id: string;
  updated_at?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

interface UserState {
  session: Session | null;
  profile: Profile | null;
  setSession: (session: Session | null) => void;
  fetchProfile: () => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  session: null,
  profile: null,
  setSession: (session) => set({ session }),
  fetchProfile: async () => {
    const { session } = get();
    if (!session?.user) {
      set({ profile: null });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      set({ profile: data });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },
  clearUser: () => set({ session: null, profile: null }),
}));