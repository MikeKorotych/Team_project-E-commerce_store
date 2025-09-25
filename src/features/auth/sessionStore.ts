import { create } from "zustand";
import { supabase } from "../../utils/supabase";
import { useCartStore } from "../../features/cart/cartStore";
import { useFavoritesStore } from "../../features/favourites/favoritesStore";
import type { Session } from "@supabase/supabase-js";
import React from "react";
import type { Profile } from "../../types/Profile";
import type { Order, OrderItem } from "@/types/Order";

interface AuthStore {
  session: Session | null;
  profile: Profile | null;
  orders: Order[] | null;
  orderItems: OrderItem[] | null;
  cartIconRef: React.RefObject<HTMLAnchorElement | null>;
  setSession: (session: Session | null) => void;
  initialize: () => (() => void) | undefined;
  fetchProfile: () => Promise<void>;
  updateProfile: (value: Partial<Profile>) => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchOrderItems: (value: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  session: null,
  profile: null,
  orders: null,
  orderItems: null,
  cartIconRef: React.createRef<HTMLAnchorElement>(),
  setSession: (session) => set({ session }),

  fetchProfile: async () => {
    const user = get().session?.user;

    if (!user) return;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error) set({ profile });
  },

  fetchOrders: async () => {
    const user = get().session?.user;

    if (!user) return;

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id);
    if (!error) set({ orders });
  },

  fetchOrderItems: async (orderId: string) => {
    if (!orderId) {
      set({ orderItems: [] });
      return;
    }

    const { data: orderItems, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (!error) {
      set({ orderItems });
    } else {
      set({ orderItems: []});
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const user = get().session?.user;
    if (!user) return;

    const {data: profile, error} = await supabase
      .from("profiles")
      .upsert({id: user.id, ...updates})
      .select()
      .single();

    if (!error) {
      set({ profile });
    }
  },

  initialize: () => {
    const { fetchCart } = useCartStore.getState();
    const { fetchFavorites } = useFavoritesStore.getState();
    const { fetchProfile, fetchOrders} = get();

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
      if (session) {
        fetchProfile();
        fetchOrders();
      }
    });

    return subscription.unsubscribe;
  },
}));
