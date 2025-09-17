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

      // Corrected the table name and the select query to join with products
      const { data, error } = await supabase
        .from('favorite_items')
        .select('*, products(*)')
        .eq('user_id', session.user.id);

      if (error) {
        set({ error: 'Failed to fetch favorites.', isLoading: false });
        return;
      }

      // The rest of the logic now works because `item.products` exists
      const typedData = data as FavoriteItemFromDB[];
      const favoriteItems: Product[] = typedData.map((item) => item.products);
      set({ favorites: favoriteItems, isLoading: false });
    },

    toggleFavorites: async (product: Product) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // todo add product to the temporary favorites state to merge with logged in state after logging in
        console.log('user not logged in');
        return;
      }

      const currentFavorites = get().favorites;
      const isFavorite = currentFavorites.some((fav) => fav.id === product.id);

      if (isFavorite) {
        // --- Удаление из избранного ---
        const { error } = await supabase
          .from('favorite_items')
          .delete()
          .match({ user_id: session.user.id, product_id: product.id });

        if (error) {
          set({ error: 'Failed to remove from favorites.' });
          return;
        }

        // Оптимистичное обновление: убираем товар из состояния
        const updatedFavorites = currentFavorites.filter(
          (fav) => fav.id !== product.id
        );
        set({ favorites: updatedFavorites });
      } else {
        // --- Добавление в избранное ---
        const { error } = await supabase.from('favorite_items').insert({
          user_id: session.user.id,
          product_id: product.id,
        });

        if (error) {
          set({ error: 'Failed to add to favorites.' });
          return;
        }

        // Оптимистичное обновление: добавляем товар в состояние
        set({ favorites: [...currentFavorites, product] });
      }
    },
  }))
);
