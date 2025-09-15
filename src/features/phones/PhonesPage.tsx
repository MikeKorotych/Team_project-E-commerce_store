import { ErrorMessage } from '@/components/error-message';
import { ProductCard } from '@/components/ProductCard';
import ProductPageNav from '@/components/ProductPageNav';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { fetchProductsByType } from '@/utils/helpers';
import { useQuery } from '@tanstack/react-query';

const PhonesPage = () => {
  // --- ОСНОВНИЙ ХУК TANSTACK QUERY ---
  const {
    data: phones, // `data` містить успішно завантажені дані, перейменовані в `phones`
    isLoading, // `true`, поки дані завантажуються
    isError, // `true`, якщо функція `fetchPhones` кинула помилку
    error, // Об'єкт помилки
    refetch, // Функція для перезавантаження даних
  } = useQuery({
    queryKey: ['products', 'phones'], // 1. Унікальний ключ для цього запиту
    queryFn: () => fetchProductsByType('phones'), // 2. Функція, яка буде виконувати запит
  });

  console.log(`Data from useQuery: `);
  console.log(phones);

  // --- ВІДОБРАЖЕННЯ СТАНУ В UI (стало ще простішим) ---

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  if (isError) {
    return <ErrorMessage message={error.message} onRetry={refetch} />;
  }

  return (
    <>
      <ProductPageNav category="Phones" />

      {/* info before items list */}
      <div className="grid grid-cols-24 gap-[8px]">
        <h1 className="text-5xl/[56px] font-bold col-start-1 col-end-9">
          Mobile phones
        </h1>
        <span className="text-sm col-start-1 col-end-3 text-dark">
          {phones?.length} models
        </span>

        <div className="flex flex-row gap-2 col-start-1 col-end-7 mt-[32px]">
          <div className="flex flex-1 flex-col gap-2">
            <span className="text-sm text-dark">Sort by:</span>
            <select className="bg-[#323542] px-3 py-2 text-sm focus:border border-[#905BFF]">
              <option>Newest</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-dark">Items on page</span>
            <select className="bg-[#323542] px-3 py-2 text-sm">
              <option className="bg-transparent">16</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 min-[490px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 col-start-1 col-end-25 mt-[16px] mb-[40px]">
          {phones?.map((phone) => {
            return <ProductCard key={phone.id} product={phone} />;
          })}
        </div>
      </div>
    </>
  );
};

export default PhonesPage;
