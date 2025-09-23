import { X } from 'lucide-react';
import QuantityController from './QuantityController';
import { useCartStore, type CartItemType } from '@/features/cart/cartStore';
import { toast } from 'sonner';

type Props = {
  item: CartItemType;
};

const CartItem: React.FC<Props> = ({ item }) => {
  const { removeFromCart } = useCartStore();

  const removeItemFromCarHandler = () => {
    removeFromCart(item.product.id);
    toast.error('Item removed from cart');
  };
  
  return (
    <div className="w-full sm:max-w-[592px] xl:max-w-[752px] bg-card flex flex-col gap-3 border shadow-sm p-4">
      <div className="flex flex-row gap-4 max-sm:flex-col justify-between">
        <div className="flex flex-row gap-6 items-center max-sm:gap-[2vw]">
          <X
            onClick={removeItemFromCarHandler}
            className="w-5 h-5 cursor-pointer  text-[#4A4D58]"
          />
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            className="h-20 w-20 object-contain"
          />

          <h2 className="text-[14px]/[21px] ">{item.product.name}</h2>
        </div>

        <div className="flex justify-between items-center max-sm:mt-4 gap-4 xl:gap-[4vw]">
          <div className="flex gap-3 items-center">
            <QuantityController currentItem={item} quantity={item.quantity} />
          </div>
          <span className="font-bold text-[22px]/[140%]">
            ${item.product.priceDiscount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
