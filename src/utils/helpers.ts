import type { ProductTypes } from '@/types/Product';
import { supabase } from './supabase';

export const fetchProductsByType = async (type: ProductTypes) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', type);

  if (error)
    throw new Error(`Error fetching products from Database: ${error.message}`);

  return data;
};

export const sortByOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price', label: 'Price' },
];

export const itemsPerPageOptions = [
  { value: '8', label: '8' },
  { value: '16', label: '16' },
  { value: '24', label: '24' },
  { value: '32', label: '32' },
];
