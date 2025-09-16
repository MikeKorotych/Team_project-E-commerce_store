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
import DropdownMenu from '@/components/DropdownMenu';

const PhonesPage = () => {
  const {
    data: phones,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products', 'phones'],
    queryFn: () => fetchProductsByType('phones'),
  });

  const [sortBy, setSortBy] = useState('newest');
  const [itemsPerPage, setItemsPerPage] = useState('16');

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

      <div className="grid grid-cols-24 gap-[8px]">
        <h1 className="text-5xl/[56px] font-bold col-start-1 col-end-24">
          Mobile phones
        </h1>
        <span className="text-sm col-start-1 col-end-3 text-dark">
          {phones?.length} models
        </span>

        <div className="flex flex-row gap-4 col-start-1 col-end-15 mt-[36px] mb-[-7px]">
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
              onValueChange={setItemsPerPage}
              triggerClassName="w-[136px]"
              contentClassName="w-[136px]"
            />
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
