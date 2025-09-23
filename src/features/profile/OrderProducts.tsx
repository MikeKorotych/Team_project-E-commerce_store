import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { OrderItem } from "./OrderItem";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderProducts = ({ open, onOpenChange }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader className="mb-4">
        <DialogTitle className="text-center mb-4">Order</DialogTitle>
        <DialogDescription className="text-center">
          <div className="flex flex-col gap-5">
            <OrderItem />
            <OrderItem />
            <OrderItem />
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);
