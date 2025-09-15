import { ProductCard } from '@/components/ProductCard';
import { supabase } from '@/utils/supabase';
import { useQuery } from '@tanstack/react-query';

//todo create type for Product

/**
 * Асинхронна функція, яка безпосередньо отримує дані.
 * TanStack Query буде викликати її автоматично.
 */

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

const PhonesPage = () => {
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
    <div className="grid grid-cols-24 gap-[8px]">
      <h1 className="text-5xl/[56px] font-bold col-start-1 col-end-9 mt-[40px]">
        Mobile phones
      </h1>
      <span className="text-sm col-start-1 col-end-3 text-[#75767F]">
        {phones?.length} models
      </span>
      <div className="flex flex-row gap-2 col-start-1 col-end-7 mt-[32px]">
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-sm text-[#75767F]">Sort by:</span>
          <select className="bg-[#323542] px-3 py-2 text-sm focus:border border-[#905BFF]">
            <option>Newest</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm text-[#75767F]">Items on page</span>
          <select className="bg-[#323542] px-3 py-2 text-sm">
            <option className="bg-transparent">16</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-8 col-start-1 col-end-25 mt-[16px] mb-[40px]">
        {phones?.map((phone) => {
          return <ProductCard key={phone.id} product={phone} />;
        })}
      </div>
    </div>
  );
};

export default PhonesPage;
