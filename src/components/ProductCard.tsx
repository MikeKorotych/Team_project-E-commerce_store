import type { Product } from '@/types/Product';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';

type Props = {
  product: Product;
};

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { addToCart, items } = useCartStore();
  const isInCart = items.some((item) => item.product.id === product.id);

  return (
    <Card className="w-full">
      <CardHeader>
        <img
          src={`${product.images[0]}`}
          alt="Product Image"
          className="object-contain h-[196px] w-[206px] mx-auto"
        />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 sm:min-h-[58px] mt-4">
          <h2 className="text-[14px]/[21px]">{product.name}</h2>
          <div className="flex flex-row gap-2 text-2xl"></div>
        </div>
        <div className="flex gap-2">
          <h2 className="font-bold text-[22px]/[140%]">
            ${product.priceDiscount}
          </h2>
          <h3 className="font-bold text-[22px]/[140%] line-through text-dark">
            ${product.priceRegular}
          </h3>
        </div>
        <div className="border-t border-[#3B3E4A] my-2" />
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-dark">Screen</span>
            <span>
              {product.screen.length > 9
                ? product.screen.slice(0, 9)
                : product.screen}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark">Capacity</span>
            <span>{product.capacity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark">RAM</span>
            <span>{product.ram}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          <Button onClick={() => addToCart(product)} className="flex-1 py-5">
            {isInCart ? 'Add one more 😍' : 'Add to cart'}
          </Button>
          <Button
            variant="secondary"
            className="items-center justify-center py-5"
          >
            <Heart />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
