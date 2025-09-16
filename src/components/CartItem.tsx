import { X } from "lucide-react";
import { Button } from "./ui/button";

type CartItemProps = {
  id: string;
  name: string;
  priceDiscount: number;
  image: string;
  quantity: number;
};

type Props = {
  item: CartItemProps;
};

export const CartItem: React.FC<Props> = ({ item }) => {
  return (
    <div className="w-full sm:max-w-[592px] xl:max-w-[752px] bg-card flex flex-col gap-3 border shadow-sm p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-6 items-center">
          <X className="w-4 h-4 cursor-pointer mr-4 text-[#4A4D58]" />
          <img
            src={item.image}
            alt={item.name}
            className="h-20 w-20 object-contain"
          />

          <h2 className="text-[14px]/[21px] ">{item.name}</h2>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-3 items-center">
            <Button variant={"outline"} className="px-4 py-4 mr-2">-</Button>
            {/* Need to use state for changing quantity */}
            <span className="text-dark mr-2">{item.quantity}</span>
            <Button variant={"secondary"} className="px-4 py-4 mr-2">+</Button>
          </div>

          <span className="font-bold text-[22px]/[140%]">
            ${item.priceDiscount}
          </span>
        </div>
      </div>
    </div>
  );
};
