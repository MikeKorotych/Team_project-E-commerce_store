import { ErrorMessage } from '@/components/error-message';
import { ProductCard } from '@/components/ProductCard';
import ProductPageNav from '@/components/ProductPageNav';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { fetchProductsByType } from '@/utils/helpers';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const AccessoriesPage = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products', 'accessories'],
    queryFn: () => fetchProductsByType('accessories'),
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

  const radioItemClassName =
    'focus:bg-secondary focus:text-[#F1F2F9] data-[state=checked]:bg-secondary data-[state=checked]:text-[#F1F2F9]';

  return (
    <>
      <ProductPageNav category="Accessories" />

      <h1 className="text-5xl/[56px] font-bold mb-2">Accessories</h1>
      <span className="text-sm text-dark">{data?.length} models</span>

      {/* DROPDOWN */}
      <div className="flex gap-4 mt-10">
        <div>
          <div className="text-dark text-xs mb-1">Sort by:</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="bg-secondary w-[187px] justify-between px-3"
              >
                <span className="capitalize">{sortBy}</span>
                <ChevronDown size={16} className="text-dark" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[187px] bg-[#0f1121] border-[#434554] text-dark p-0">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem
                  value="newest"
                  className={radioItemClassName}
                >
                  Newest
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="price"
                  className={radioItemClassName}
                >
                  Price
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-6">
          <div className="text-dark text-xs mb-1">Items on page:</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="bg-secondary border-[#434554] w-[136px] justify-between px-3"
              >
                {itemsPerPage}
                <ChevronDown size={16} className="text-dark" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[136px] bg-[#0f1121] border-[#434554] text-dark p-0">
              <DropdownMenuRadioGroup
                value={itemsPerPage}
                onValueChange={setItemsPerPage}
              >
                <DropdownMenuRadioItem value="8" className={radioItemClassName}>
                  8
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="16"
                  className={radioItemClassName}
                >
                  16
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="32"
                  className={radioItemClassName}
                >
                  32
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="24"
                  className={radioItemClassName}
                >
                  24
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 min-[490px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.map((item) => (
          <ProductCard key={item.id} product={item}></ProductCard>
        ))}
      </div>
    </>
  );
};

export default AccessoriesPage;
