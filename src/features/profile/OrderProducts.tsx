import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderItemProps } from "./OrderItemProps";
import { useAuthStore } from "../auth/sessionStore";
import { useEffect } from "react";

interface Props {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderProducts = ({ orderId, open, onOpenChange }: Props) => {
  const { orderItems, fetchOrderItems } = useAuthStore();

  useEffect(() => {
    if (orderId) {
      fetchOrderItems(orderId)
    }
  }, [orderId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center mb-4">Order</DialogTitle>
          <DialogDescription className="text-center">
            <div className="flex flex-col gap-5">
              {orderItems?.map(item => <OrderItemProps orderItem={item} />)}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
