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
