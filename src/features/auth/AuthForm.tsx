import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
import { useCartStore } from "@/features/cart/cartStore";
import { useFavoritesStore } from "@/features/favourites/favoritesStore";

type FormData = {
  email: string;
  password: string;
};

export const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { mergeAndSyncCarts } = useCartStore();
  const { mergeAndSyncFavorites } = useFavoritesStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    const { email, password } = data;

    try {
      let error;
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        error = signUpError;
        if (!error) {
          toast.success(
            "Registration successful! Please check your email for confirmation."
          );
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        error = signInError;
        if (!error) {
          toast.success("You have successfully logged in!");
          await Promise.all([mergeAndSyncCarts(), mergeAndSyncFavorites()]);
        }
      }
      if (error) {
        setServerError(error.message);
        toast.error(error.message);
      }
    } catch (error: any) {
      setServerError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="youremail@example.com"
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address.",
            },
          })}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="********"
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters.",
            },
          })}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      {serverError && (
        <p className="text-sm text-red-500 text-center">{serverError}</p>
      )}
      <Button type="submit" disabled={isSubmitting} className="w-full mt-5">
        {isSubmitting ? <Spinner /> : isSignUp ? "Sign Up" : "Sign In"}
      </Button>
      <Button
        type="button"
        variant="link"
        onClick={() => {
          setIsSignUp(!isSignUp);
          setServerError(null);
        }}
      >
        {isSignUp
          ? "Already have an account? Sign In"
          : "Don't have an account? Sign Up"}
      </Button>
    </form>
  );
};
