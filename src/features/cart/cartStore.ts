import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '../../utils/supabase';
import type { Product } from '@/types/Product';

// This is the shape of data coming from Supabase when joining tables
interface CartItemFromDB {
  user_id: string;
  product_id: string;
  quantity: number;
  products: Product; // Supabase nests the joined table data
}

// Define the type for a single item in the cart for our app state
export interface CartItem {
  product: Product;
  quantity: number;
}

// Define the state structure
interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  devtools(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      fetchCart: async () => {
        set({ isLoading: true, error: null });
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          set({ items: [], isLoading: false }); // No user, cart is empty
          return;
        }

        const { data, error } = await supabase
          .from('cart_items')
          .select('*, products(*)') // Join with products table
          .eq('user_id', session.user.id);

        if (error) {
          set({ error: 'Failed to fetch cart.', isLoading: false });
        } else {
          // Map the data from DB shape to our app's state shape
          const typedData = data as CartItemFromDB[];
          const cartItems: CartItem[] = typedData.map((item) => ({
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
        if (!session) return; // Or show a login prompt

        const currentItems = get().items;
        const itemExists = currentItems.find(
          (item) => item.product.id === product.id
        );

        if (itemExists) {
          // Item exists, update quantity
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
          // Item does not exist, insert new row
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
        if (!session) return;

        const { error } = await supabase
          .from('cart_items')
          .delete()
          .match({ user_id: session.user.id, product_id: productId });

        if (error) {
          set({ error: 'Failed to remove item.' });
        } else {
          const updatedItems = get().items.filter(
            (item) => item.product.id !== productId
          );
          set({ items: updatedItems });
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
        if (!session) return;

        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .match({ user_id: session.user.id, product_id: productId });

        if (error) {
          set({ error: 'Failed to update quantity.' });
        } else {
          const updatedItems = get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          );
          set({ items: updatedItems });
        }
      },
    }),
    { name: 'CartStore' }
  )
);
