import type { Product } from '@/types/Product';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';

type Props = {
  product: Product;
};

export const ProductCard: React.FC<Props> = ({ product }) => (
  <Card>
    <CardHeader>
      <img
        src={`${product.images[0]}`}
        alt="Product Image"
        className="object-contain h-[196px] w-[206px]"
      />
    </CardHeader>
    <CardContent>
      <div className="flex flex-col gap-2 min-h-[58px] mt-4">
        <h2 className="">{product.name}</h2>
        <div className="flex flex-row gap-2 text-2xl"></div>
      </div>
      <div className="flex gap-2">
        <h2 className="font-bold">${product.priceRegular}</h2>
        <h3 className="font-bold line-through card--dark-text">
          ${product.priceDiscount}
        </h3>
      </div>
      <div className="border-t border-[#3B3E4A] my-2" />
      <div className="flex flex-col gap-2 text-xs">
        <div className="flex justify-between">
          <span className="card--dark-text">Screen</span>
          <span>
            {product.screen.length > 9
              ? product.screen.slice(0, 9)
              : product.screen}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="card--dark-text">Capacity</span>
          <span>{product.capacity}</span>
        </div>
        <div className="flex justify-between">
          <span className="card--dark-text">RAM</span>
          <span>{product.ram}</span>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <div className="flex w-full gap-2">
        <Button className="flex-1 h-[40px]">Add to cart</Button>
        <Button
          variant="secondary"
          className="h-[40px] w-[40px] items-center justify-center"
        >
          <Heart />
        </Button>
      </div>
    </CardFooter>
  </Card>
);
