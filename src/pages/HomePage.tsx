// import { ProductCard } from "@/components/ProductCard";
import { ModelsRow } from '@/components/ModelsRow';
import { ProductCarousel } from '@/components/ProductCarousel';
import { supabase } from '@/utils/supabase';
import { useQuery } from '@tanstack/react-query';
import { HomeShopCategory } from '@/components/HomeShopCategory';

export const HomePage = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const fetchPhones = async () => {
    // request to Supabase
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'phones');

    // process error
    if (error) {
      throw new Error(`Error fetching phones from Supabase: ${error.message}`);
    }
    console.log(`Data from fetchPhones: `);
    console.log(data);
    return data;
  };
  // --- ОСНОВНИЙ ХУК TANSTACK QUERY ---
  const {
    data: phones, // `data` містить успішно завантажені дані, перейменовані в `phones`
    isLoading, // `true`, поки дані завантажуються
    isError, // `true`, якщо функція `fetchPhones` кинула помилку
    error, // Об'єкт помилки
  } = useQuery({
    queryKey: ['products', 'phones'], // 1. Унікальний ключ для цього запиту
    queryFn: fetchPhones, // 2. Функція, яка буде виконувати запит
  });

  console.log(`Data from useQuery: `);
  console.log(phones);

  // --- ВІДОБРАЖЕННЯ СТАНУ В UI (стало ще простішим) ---

  if (isLoading) {
    return <div>Loading phones...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <h1 className="font-bold text-[32px] min-[855px]:text-[48px] pb-[24px] sm:pb-[32px] md:pb-[56px] sm:pt-[8px] lg:pt-[32px]">
        Welcome to Nice Gadgets store!
      </h1>

      <ProductCarousel supabaseUrl={supabaseUrl} />
      <ModelsRow title={'Brand new models'} product={phones?.slice(0, 4)} />
      <HomeShopCategory supabaseUrl={supabaseUrl} />
      <ModelsRow title={'Hot prices'} product={phones?.slice(0, 4)} />
    </>
  );
};
