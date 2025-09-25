import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { OrderItemProps } from "./OrderItemProps";
import { useAuthStore } from "../auth/sessionStore";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

interface Props {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderProducts = ({ orderId, open, onOpenChange }: Props) => {
  const { orderItems, fetchOrderItems } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (orderId) {
      fetchOrderItems(orderId);
    }
    setTimeout(() => setIsLoading(false), 300);
  }, [orderId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center mb-4">
            Order #{orderId}
          </DialogTitle>
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner width={30} height={30} />
            </div>
          ) : (
            <div className="bg-card p-5 overflow-y-auto max-h-[400px]">
              <table className="w-full border shadow-sm text-center min-w-[600px]">
                <thead>
                  <th className="px-7 py-2 border">Product Image</th>
                  <th className="px-7 py-2 border">Product ID</th>
                  <th className="px-7 py-2 border">Quantity</th>
                  <th className="px-7 py-2 border">Price</th>
                </thead>
                <tbody>
                  {orderItems?.map((item) => (
                    <OrderItemProps orderItem={item} key={item.id} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
