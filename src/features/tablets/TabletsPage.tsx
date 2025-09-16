import DropDownMenu from '@/components/DropdownMenu';
import { ErrorMessage } from '@/components/error-message';
import { ProductCard } from '@/components/ProductCard';
import ProductPageNav from '@/components/ProductPageNav';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import {
  fetchProductsByType,
  itemsPerPageOptions,
  sortByOptions,
} from '@/utils/helpers';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const TabletsPage = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products', 'tablets'],
    queryFn: () => fetchProductsByType('tablets'),
  });
  const [sortBy, setSortBy] = useState('newest');
  const [itemsPerPage, setItemsPerPage] = useState('8');

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
      <ProductPageNav category="Tablets" />

      <h1 className="text-5xl/[56px] font-bold mb-2">Tablets</h1>
      <span className="text-sm text-dark">{data?.length} models</span>

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

      <div className="grid grid-cols-1 min-[490px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 col-start-1 col-end-25 mt-[16px] mb-[40px]">
        {data?.map((item) => (
          <ProductCard key={item.id} product={item}></ProductCard>
        ))}
      </div>
    </>
  );
};

export default TabletsPage;
