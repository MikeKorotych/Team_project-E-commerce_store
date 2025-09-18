import { ErrorMessage } from "@/components/error-message";
import { ProductCard } from "@/components/ProductCard";
import ProductPageNav from "@/components/ProductPageNav";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import {
  fetchProductsByType,
  itemsPerPageOptions,
  sortByOptions,
} from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DropDownMenu from "@/components/DropDownMenu";
import { useSortProducts } from "@/hooks/useSortProducts";

const AccessoriesPage = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["products", "products"],
    queryFn: () => fetchProductsByType("accessories"),
  });

  const initialSortby = sortByOptions[0].value;

  const [sortBy, setSortBy] = useState(initialSortby);
  const [itemsPerPage, setItemsPerPage] = useState("8");

  const sortedData = useSortProducts(data || [], sortBy, "asc");

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
      <ProductPageNav category="Accessories" />

      <h1 className="page-title">Accessories</h1>
      <span className="text-sm/[21px] text-dark">{data?.length} models</span>

      <div className="flex gap-4 mt-10">
        <DropDownMenu
          label="Sort by:"
          options={sortByOptions}
          value={sortBy}
          onValueChange={setSortBy}
          triggerClassName="w-[187px] max-[380px]:w-[136px]"
          contentClassName="w-[187px] max-[380px]:w-[136px]"
        />
        <div className="mb-6">
          <DropDownMenu
            label="Items on page:"
            options={itemsPerPageOptions}
            value={itemsPerPage}
            onValueChange={setItemsPerPage}
            triggerClassName="w-[136px]"
            contentClassName="w-[136px]"
          />
        </div>
      </div>

      <div className="products-table">
        {sortedData.map((item) => (
          <ProductCard key={item.id} product={item}></ProductCard>
        ))}
      </div>
    </>
  );
};

export default AccessoriesPage;
