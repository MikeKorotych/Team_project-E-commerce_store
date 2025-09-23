import { create } from "zustand";
import { supabase } from "../../utils/supabase";
import { useCartStore } from "../../features/cart/cartStore";
import { useFavoritesStore } from "../../features/favourites/favoritesStore";
import type { Session } from "@supabase/supabase-js";
import React from "react";

interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface AuthStore {
  session: Session | null;
  profile: Profile | null;
  cartIconRef: React.RefObject<HTMLAnchorElement | null>;
  setSession: (session: Session | null) => void;
  initialize: () => (() => void) | undefined;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  session: null,
  profile: null,
  cartIconRef: React.createRef<HTMLAnchorElement>(),
  setSession: (session) => set({ session }),

  initialize: () => {
    const { fetchCart } = useCartStore.getState();
    const { fetchFavorites } = useFavoritesStore.getState();

    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session });
    });

    fetchCart();
    fetchFavorites();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session });
      fetchCart(); // Also fetch cart on auth state change (login/logout)
      fetchFavorites(); // Also fetch favorites on auth state change
    });

    return subscription.unsubscribe;
  },

  fetchProfile: async () => {
    const user = get().session?.user;
    if (!user) return;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (!error) set({ profile });
  }
}));
