import { useCartStore, type CartItem } from '@/features/cart/cartStore';
import { useTransition } from 'react';
import { Button } from './ui/button';
import { Minus, Plus } from 'lucide-react';
import { Spinner } from './ui/shadcn-io/spinner';
import { toast } from 'sonner';

type QCProps = {
  currentItem: CartItem;
  quantity: number;
};

const QuantityController: React.FC<QCProps> = ({ currentItem, quantity }) => {
  const { updateQuantity } = useCartStore();
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (newQuantity: number) => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await updateQuantity(currentItem.product.id, newQuantity);
    });
  };

  return (
    <div className="flex justify-start items-center gap-3.5 w-full">
      <Button
        disabled={isPending}
        className="py-5"
        onClick={() => {
          handleUpdate(quantity - 1);
          toast.error('Item removed from cart');
        }}
      >
        <Minus />
      </Button>
      {isPending ? (
        <Spinner width={16} height={16} />
      ) : (
        <div className="w-4 text-center">{quantity}</div>
      )}
      <Button
        disabled={isPending}
        className="py-5"
        onClick={() => {
          handleUpdate(quantity + 1);
          toast.success('Item added to cart');
        }}
      >
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityController;
