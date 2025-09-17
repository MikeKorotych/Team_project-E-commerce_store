import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '../../utils/supabase';
import type { Product } from '@/types/Product';

interface FavoriteItemFromDB {
  user_id: string;
  product_id: string;
  products: Product; // Supabase nests the joined table data
}

type FavoritesState = {
  favorites: Product[];
  isLoading: boolean;
  error: string | null;
  toggleFavorites: (product: Product) => void;
  fetchFavorites: () => Promise<void>;
};

export const useFavoritesStore = create<FavoritesState>()(
  devtools((set, get) => ({
    favorites: [],
    isLoading: false,
    error: null,

    fetchFavorites: async () => {
      set({ isLoading: true, error: null });
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        set({ favorites: [], isLoading: false });
        return;
      }
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) {
        set({ error: 'Failed to fetch favorites.', isLoading: false });
      }

      const typedData = data as FavoriteItemFromDB[];
      // const cartItems: CartItem[] = typedData.map();
    },
  }))
);
