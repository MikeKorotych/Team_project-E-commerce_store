// import { ProductCard } from "@/components/ProductCard";
import { ModelsRow } from "@/components/ModelsRow";
import { ProductCarousel } from "@/components/ProductCarousel";
import { supabase } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { HomeShopCategory } from "@/components/HomeShopCategory";
import type { Product } from "@/types/Product";

export const HomePage = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const fetchPhones = async () => {
    // request to Supabase
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", "phones");

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
    queryKey: ["products", "phones"], // 1. Унікальний ключ для цього запиту
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

  const fetchedPhones: Product[] = phones?.slice(0, 4);
  console.log("firstfour", fetchedPhones);

  return (
    <>
      <h1 className="font-bold text-[32px] py-[24px] sm:text-5xl sm:py-[32px] md:py-[56px] md:text-[48px]">
        Welcome to Nice Gadgets store!
      </h1>

      <ProductCarousel supabaseUrl={supabaseUrl} />
      <ModelsRow title={"Brand new models"} product={fetchedPhones} />
      <HomeShopCategory supabaseUrl={supabaseUrl} />
      <ModelsRow title={"Hot prices"} product={fetchedPhones} />

      {/* <ProductCard product={phones[0]} /> */}
    </>
  );
};
