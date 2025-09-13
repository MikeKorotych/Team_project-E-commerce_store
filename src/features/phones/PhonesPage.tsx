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
    <div>
      PhonesPage
      <ul>
        {phones?.map((phone) => (
          <li key={phone.id}>
            {phone.name}
            <img src={phone.images[0]} alt="" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PhonesPage;
