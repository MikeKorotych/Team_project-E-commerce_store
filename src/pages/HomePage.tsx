// import { ProductCard } from "@/components/ProductCard";
import { ModelsRow } from "@/components/ModelsRow";
import { ProductCarousel } from "@/components/ProductCarousel";
import { supabase } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { HomeShopCategory } from "@/components/HomeShopCategory";

export const HomePage = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const fetchPhones = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", "phones");
    if (error) {
      throw new Error(`Error fetching phones from Supabase: ${error.message}`);
    }
    console.log(`Data from fetchPhones: `);
    console.log(data);
    return data;
  };
  const {
    data: phones,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", "phones"],
    queryFn: fetchPhones,
  });

  if (isLoading) {
    return <div>Loading phones...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const newestPhones = (phones ?? [])
    .slice()
    .sort((a, b) => b.year - a.year)
    .slice(0, 16);

  const hotPricesPhones = (phones ?? [])
    .slice()
    .sort((a, b) => a.priceDiscount - b.priceDiscount)
    .slice(0, 16);

  return (
    <>
      <h1 className="font-bold text-[32px] min-[855px]:text-[48px] pb-[24px] sm:pb-[32px] md:pb-[56px] sm:pt-[8px] lg:pt-[32px]">
        Welcome to Nice Gadgets store!
      </h1>

      <ProductCarousel supabaseUrl={supabaseUrl} />
      <ModelsRow title={"Brand new models"} product={newestPhones} />
      <HomeShopCategory supabaseUrl={supabaseUrl} />
      <ModelsRow title={"Hot prices"} product={hotPricesPhones} />
    </>
  );
};
