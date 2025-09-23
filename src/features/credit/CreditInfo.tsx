import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pen } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditInfo = ({ open, onOpenChange }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader className="mb-4">
        <DialogTitle className="text-center mb-4">Card Info</DialogTitle>
        <DialogDescription className="text-center">
          <div className="flex flex-col bg-card gap-5 p-5">
            <span>Sorry... It will be ready tommorow.</span>
          </div>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant={"ghost"}>
          <Pen />
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
