import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '../../utils/supabase';
import type { Product } from '@/types/Product';
import { getLocalStorage, setLocalStorage } from '@/utils/helpers';

// This is the shape of data coming from Supabase when joining tables
interface CartItemFromDB {
  user_id: string;
  product_id: string;
  quantity: number;
  products: Product; // Supabase nests the joined table data
}

// Define the type for a single item in the cart for our app state
export type CartItemType = {
  product: Product;
  quantity: number;
};

const GUEST_CART_KEY = 'guestCart';

// Define the state structure
interface CartState {
  items: CartItemType[];
  isLoading: boolean;
  error: string | null;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  mergeAndSyncCarts: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  devtools(
    (set, get) => ({
      items: getLocalStorage<CartItemType[]>(GUEST_CART_KEY, []),
      isLoading: false,
      error: null,

      fetchCart: async () => {
        set({ isLoading: true, error: null });
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          const guestCart = getLocalStorage<CartItemType[]>(GUEST_CART_KEY, []);
          set({ items: guestCart, isLoading: false });
          return;
        }

        const { data, error } = await supabase
          .from('cart_items')
          .select('*, products(*)') // Join with products table
          .eq('user_id', session.user.id);

        if (error) {
          set({ error: 'Failed to fetch cart.', isLoading: false });
        } else {
          const typedData = data as CartItemFromDB[];
          const cartItems: CartItemType[] = typedData.map((item) => ({
            product: item.products,
            quantity: item.quantity,
          }));
          set({ items: cartItems, isLoading: false });
        }
      },

      addToCart: async (product: Product) => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const currentItems = get().items;
        const itemExists = currentItems.find(
          (item) => item.product.id === product.id
        );

        if (!session) {
          const newItems = itemExists
            ? currentItems.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            : [...currentItems, { product, quantity: 1 }];
          set({ items: newItems });
          setLocalStorage(GUEST_CART_KEY, newItems);
          return;
        }

        if (itemExists) {
          const newQuantity = itemExists.quantity + 1;
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity: newQuantity })
            .match({ user_id: session.user.id, product_id: product.id });

          if (error) {
            set({ error: 'Failed to update cart.' });
          } else {
            const updatedItems = currentItems.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            );
            set({ items: updatedItems });
          }
        } else {
          const { error } = await supabase.from('cart_items').insert({
            user_id: session.user.id,
            product_id: product.id,
            quantity: 1,
          });

          if (error) {
            set({ error: 'Failed to add to cart.' });
          } else {
            set({ items: [...currentItems, { product, quantity: 1 }] });
          }
        }
      },

      removeFromCart: async (productId: string) => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const currentItems = get().items;
        const newItems = currentItems.filter(
          (item) => item.product.id !== productId
        );

        if (!session) {
          set({ items: newItems });
          setLocalStorage(GUEST_CART_KEY, newItems);
          return;
        }

        const { error } = await supabase
          .from('cart_items')
          .delete()
          .match({ user_id: session.user.id, product_id: productId });

        if (error) {
          set({ error: 'Failed to remove item.' });
        } else {
          set({ items: newItems });
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();
        const currentItems = get().items;
        const newItems = currentItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );

        if (!session) {
          set({ items: newItems });
          setLocalStorage(GUEST_CART_KEY, newItems);
          return;
        }

        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .match({ user_id: session.user.id, product_id: productId });

        if (error) {
          set({ error: 'Failed to update quantity.' });
        } else {
          set({ items: newItems });
        }
      },

      mergeAndSyncCarts: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        set({ isLoading: true });
        const guestCart = getLocalStorage<CartItemType[]>(GUEST_CART_KEY, []);
        if (guestCart.length === 0) {
          await get().fetchCart();
          set({ isLoading: false });
          return;
        }

        const { data: dbCartData, error: fetchError } = await supabase
          .from('cart_items')
          .select('*, products(*)')
          .eq('user_id', session.user.id);

        if (fetchError) {
          set({ error: 'Failed to fetch cart for merging.', isLoading: false });
          return;
        }

        const dbCartItems: CartItemType[] = (dbCartData as CartItemFromDB[]).map(
          (item) => ({
            product: item.products,
            quantity: item.quantity,
          })
        );

        const mergedCartMap = new Map<string, CartItemType>();
        dbCartItems.forEach((item) => mergedCartMap.set(item.product.id, item));
        guestCart.forEach((guestItem) => {
          const existingItem = mergedCartMap.get(guestItem.product.id);
          if (existingItem) {
            existingItem.quantity += guestItem.quantity;
          } else {
            mergedCartMap.set(guestItem.product.id, guestItem);
          }
        });

        const finalCart = Array.from(mergedCartMap.values());

        const { error: deleteError } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', session.user.id);

        if (deleteError) {
          set({
            error: 'Failed to clear old cart for merging.',
            isLoading: false,
          });
          return;
        }

        const itemsToInsert = finalCart.map((item) => ({
          user_id: session.user.id,
          product_id: item.product.id,
          quantity: item.quantity,
        }));

        const { error: insertError } = await supabase
          .from('cart_items')
          .insert(itemsToInsert);

        if (insertError) {
          set({ error: 'Failed to save merged cart.', isLoading: false });
        } else {
          set({ items: finalCart, isLoading: false });
          setLocalStorage(GUEST_CART_KEY, []);
        }
      },
    }),
    { name: 'CartStore' }
  )
);