import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useAuthStore } from "@/features/auth/sessionStore";
import { useState } from "react";
import { toast } from "sonner";
// import { Spinner } from "@/components/ui/shadcn-io/spinner";

const defaultUserAvatars = [
  "https://fyierinnvqolkkbtimal.supabase.co/storage/v1/object/public/product-images/img/default-ava-male.jpg",
  "https://fyierinnvqolkkbtimal.supabase.co/storage/v1/object/public/product-images/img/default-ava-female.jpg",
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AvatarsChanger = ({ open, onOpenChange }: Props) => {
  const { updateProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeAvatar = async (avatar: string) => {
    setIsLoading(true);
    try {
      await updateProfile({ user_ava: avatar });
      onOpenChange(false);
      toast.success(`Avatar has been changed`)
    } catch {
      toast.error(`Can't change the avatar...`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center mb-4">Avatars</DialogTitle>
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner width={30} height={30} />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 bg-card p-5">
              <img
                src={defaultUserAvatars[0]}
                alt="Defaul Ava Male"
                className="h-50 w-50 object-contain cursor-pointer"
                onClick={() => {
                  handleChangeAvatar(defaultUserAvatars[0]);
                }}
              />
              <img
                src={defaultUserAvatars[1]}
                alt="Defaul Ava Female"
                className="h-50 w-50 object-contain cursor-pointer"
                onClick={() => {
                  handleChangeAvatar(defaultUserAvatars[1]);
                }}
              />
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
