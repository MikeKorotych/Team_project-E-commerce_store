import type { Product } from '@/types/Product';
import { Card, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';

type Props = {
  product: Product;
};

export const ProductCard: React.FC<Props> = ({ product }) => (
  <Card>
    <CardHeader>
      <img src={`../../${product.images[0]}`} alt="Product Image" />
      <h2 className="font-semibold">{product.name}</h2>
      <h1 className="font-bold">{product.priceRegular}</h1>
      <div className="grid grid-cols-2 grid-rows-3 gap-2">
        <span className="text-[#75767F]">Screen</span>
        <span>{product.screen}</span>
        <span className="text-[#75767F]">Capacity</span>
        <span>{product.capacity}</span>
        <span className="text-[#75767F]">RAM</span>
        <span>{product.ram}</span>
      </div>
    </CardHeader>
    <CardFooter className="flex gap-2">
      <Button className="w-max">Add to cart</Button>
      <Button variant="secondary" className="w-max">
        <Heart />
      </Button>
    </CardFooter>
  </Card>
);
