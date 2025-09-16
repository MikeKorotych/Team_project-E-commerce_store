import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AuthForm } from './AuthForm';
import type { SupabaseClient } from '@supabase/supabase-js';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supabaseClient: SupabaseClient;
}

export const AuthModal = ({
  open,
  onOpenChange,
  supabaseClient,
}: AuthModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center">Authentication</DialogTitle>
          <DialogDescription className="text-center">
            Sign in or create an account to continue.
          </DialogDescription>
        </DialogHeader>
        <AuthForm supabaseClient={supabaseClient} />
      </DialogContent>
    </Dialog>
  );
};
