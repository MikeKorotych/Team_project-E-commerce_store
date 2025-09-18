import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '../../utils/supabase';
import type { Product } from '@/types/Product';
import { getLocalStorage, setLocalStorage } from '@/utils/helpers';

interface FavoriteItemFromDB {
  user_id: string;
  product_id: string;
  products: Product;
}

const GUEST_FAVORITES_KEY = 'guestFavorites';

type FavoritesState = {
  favorites: Product[];
  isLoading: boolean;
  error: string | null;
  toggleFavorites: (product: Product) => void;
  fetchFavorites: () => Promise<void>;
  mergeAndSyncFavorites: () => Promise<void>;
};

export const useFavoritesStore = create<FavoritesState>()(
  devtools((set, get) => ({
    favorites: getLocalStorage<Product[]>(GUEST_FAVORITES_KEY, []),
    isLoading: false,
    error: null,

    fetchFavorites: async () => {
      set({ isLoading: true, error: null });
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        const guestFavorites = getLocalStorage<Product[]>(GUEST_FAVORITES_KEY, []);
        set({ favorites: guestFavorites, isLoading: false });
        return;
      }

      const { data, error } = await supabase
        .from('favorite_items')
        .select('*, products(*)')
        .eq('user_id', session.user.id);

      if (error) {
        set({ error: 'Failed to fetch favorites.', isLoading: false });
        return;
      }

      const typedData = data as FavoriteItemFromDB[];
      const favoriteItems: Product[] = typedData.map((item) => item.products);
      set({ favorites: favoriteItems, isLoading: false });
    },

    toggleFavorites: async (product: Product) => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentFavorites = get().favorites;
      const isFavorite = currentFavorites.some((fav) => fav.id === product.id);

      if (!session) {
        const newFavorites = isFavorite
          ? currentFavorites.filter((fav) => fav.id !== product.id)
          : [...currentFavorites, product];
        set({ favorites: newFavorites });
        setLocalStorage(GUEST_FAVORITES_KEY, newFavorites);
        return;
      }

      if (isFavorite) {
        const { error } = await supabase
          .from('favorite_items')
          .delete()
          .match({ user_id: session.user.id, product_id: product.id });

        if (error) {
          set({ error: 'Failed to remove from favorites.' });
        } else {
          const updatedFavorites = currentFavorites.filter(
            (fav) => fav.id !== product.id
          );
          set({ favorites: updatedFavorites });
        }
      } else {
        const { error } = await supabase.from('favorite_items').insert({
          user_id: session.user.id,
          product_id: product.id,
        });

        if (error) {
          set({ error: 'Failed to add to favorites.' });
        } else {
          set({ favorites: [...currentFavorites, product] });
        }
      }
    },

    mergeAndSyncFavorites: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      set({ isLoading: true });
      const guestFavorites = getLocalStorage<Product[]>(GUEST_FAVORITES_KEY, []);
      if (guestFavorites.length === 0) {
        await get().fetchFavorites();
        set({ isLoading: false });
        return;
      }

      const { data: dbFavoritesData, error: fetchError } = await supabase
        .from('favorite_items')
        .select('*, products(*)')
        .eq('user_id', session.user.id);

      if (fetchError) {
        set({ error: 'Failed to fetch favorites for merging.', isLoading: false });
        return;
      }

      const dbFavorites: Product[] = (dbFavoritesData as FavoriteItemFromDB[]).map(
        (item) => item.products
      );

      const mergedFavoritesMap = new Map<string, Product>();
      dbFavorites.forEach((item) => mergedFavoritesMap.set(item.id, item));
      guestFavorites.forEach((item) => mergedFavoritesMap.set(item.id, item));

      const finalFavorites = Array.from(mergedFavoritesMap.values());

      const { error: deleteError } = await supabase
        .from('favorite_items')
        .delete()
        .eq('user_id', session.user.id);

      if (deleteError) {
        set({ error: 'Failed to clear old favorites.', isLoading: false });
        return;
      }

      const itemsToInsert = finalFavorites.map((item) => ({
        user_id: session.user.id,
        product_id: item.id,
      }));

      const { error: insertError } = await supabase
        .from('favorite_items')
        .insert(itemsToInsert);

      if (insertError) {
        set({ error: 'Failed to save merged favorites.', isLoading: false });
      } else {
        set({ favorites: finalFavorites, isLoading: false });
        setLocalStorage(GUEST_FAVORITES_KEY, []);
      }
    },
  }))
);