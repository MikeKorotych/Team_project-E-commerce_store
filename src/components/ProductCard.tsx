import type { Product } from "@/types/Product";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

type Props = {
  product: Product;
};

export const ProductCard: React.FC<Props> = ({ product }) => (
  <Card>
    <CardHeader>
      <img
        src={`${product.images[0]}`}
        alt="Product Image"
        className="object-contain h-[196px] w-[206px] mt-[32px]"
      />
    </CardHeader>
    <CardContent>
      <h2 className="mt-[16px]">{product.name}</h2>
      <div className="flex flex-row gap-2 text-2xl">
        <h1 className="font-bold">${product.priceRegular}</h1>
        <h1 className="font-bold line-through text-[#75767F]">
          ${product.priceDiscount}
        </h1>
      </div>
      <div className="border-t border-[#3B3E4A] my-2" />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-[#75767F]">Screen</span>
          <span>{product.screen.length > 9 ? product.screen.slice(0, 9) : product.screen}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#75767F]">Capacity</span>
          <span>{product.capacity}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#75767F]">RAM</span>
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
          ❤
        </Button>
      </div>
    </CardFooter>
  </Card>
);
