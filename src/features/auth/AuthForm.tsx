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
<<<<<<< Updated upstream
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
=======
>>>>>>> Stashed changes

type FormData = {
  email: string;
  password: string;
<<<<<<< Updated upstream
=======
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
    reset,
>>>>>>> Stashed changes
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setServerError(null);

    try {
      let error;
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              first_name: data.firstName,
              last_name: data.lastName,
              phone_number: data.phoneNumber,
            },
          },
        });
        error = signUpError;
        if (!error) {
          toast.success(
            "Registration successful! Please check your email for confirmation."
<<<<<<< Updated upstream
            "Registration successful! Please check your email for confirmation."
=======
>>>>>>> Stashed changes
          );
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        error = signInError;
        if (!error) {
          toast.success("You have successfully logged in!");
<<<<<<< Updated upstream
          toast.success("You have successfully logged in!");
=======
>>>>>>> Stashed changes
          await Promise.all([mergeAndSyncCarts(), mergeAndSyncFavorites()]);
        }
      }
      if (error) {
        setServerError(error.message);
<<<<<<< Updated upstream
        setServerError(error.message);
=======
>>>>>>> Stashed changes
        toast.error(error.message);
      }
    } catch (error: any) {
      setServerError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      {isSignUp && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                {...register("firstName", {
                  required: "First name is required.",
                })}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register("lastName", {
                  required: "Last name is required.",
                })}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+1234567890"
              {...register("phoneNumber", {
                required: "Phone number is required.",
              })}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </>
      )}
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="youremail@example.com"
<<<<<<< Updated upstream
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address.",
            },
          })}
=======
          {...register("email", { required: "Email is required." })}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters.",
            },
          })}
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        {isSubmitting ? <Spinner /> : isSignUp ? "Sign Up" : "Sign In"}
=======
>>>>>>> Stashed changes
      </Button>
      <Button
        type="button"
        variant="link"
        onClick={() => {
          setIsSignUp(!isSignUp);
          setServerError(null);
          reset(); // Сбрасываем форму при переключении
        }}
      >
        {isSignUp
          ? "Already have an account? Sign In"
<<<<<<< Updated upstream
          ? "Already have an account? Sign In"
=======
>>>>>>> Stashed changes
          : "Don't have an account? Sign Up"}
      </Button>
    </form>
  );
};
