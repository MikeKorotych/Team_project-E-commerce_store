import { ErrorMessage } from "@/components/error-message";
import ProductPageNav from "@/components/ProductPageNav";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import {
  fetchProductsByType,
  itemsPerPageOptions,
  sortByOptions,
} from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import DropdownMenu from "@/components/DropDownMenu";
import { PaginationArea } from "@/components/Pagination/PaginationArea";
import { useSearchParams } from "react-router";

const PhonesPage = () => {
  const {
    data: phones,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", "phones"],
    queryFn: () => fetchProductsByType("phones"),
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const [sortBy, setSortBy] = useState("newest");
  const itemsPerPage = searchParams.get("limit") || "16";

  const handleChangeItemsPerPage = (value: string) => {
    searchParams.set("limit", value);
    setSearchParams(searchParams, { replace: true });
  };

  useEffect(() => {
    if (!searchParams.get("limit")) {
      searchParams.set("limit", "16");
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, searchParams]);

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

      <h1 className="page-title">Mobile phones</h1>
      <span className="text-sm/[21px] text-dark">{phones?.length} models</span>

      <div className="flex gap-4 mt-10">
        <DropdownMenu
          label="Sort by:"
          options={sortByOptions}
          value={sortBy}
          onValueChange={setSortBy}
          triggerClassName="w-[187px] max-[380px]:w-[136px]"
          contentClassName="w-[187px] max-[380px]:w-[136px]"
        />
        <div className="mb-6">
          <DropdownMenu
            label="Items on page:"
            options={itemsPerPageOptions}
            value={itemsPerPage}
            onValueChange={(value) => handleChangeItemsPerPage(value)}
            triggerClassName="w-[136px]"
            contentClassName="w-[136px]"
          />
        </div>
      </div>
  
      <PaginationArea
        products={phones || []}
        itemsPerPage={Number(itemsPerPage)}
      />
    </>
  );
};

export default PhonesPage;
