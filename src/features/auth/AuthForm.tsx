import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';

// Define the validation schema
const formSchema = z.object({
  email: z.email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormData = z.infer<typeof formSchema>;

export const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    const { email, password } = data;

    try {
      let error;
      if (isSignUp) {
        // Регистрация
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        error = signUpError;
        if (!error) {
          toast.success(
            'Registration successful! Please check your email for confirmation.'
          );
        }
      } else {
        // Вход
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        error = signInError;
        if (!error) {
          toast.success('You have successfully logged in!');
        }
      }

      // Если есть ошибка, показываем тост с ошибкой
      if (error) {
        setServerError(error.message); // Можно оставить для отображения ошибки в форме
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
          {...register('email')}
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
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      {serverError && (
        <p className="text-sm text-red-500 text-center">{serverError}</p>
      )}
      <Button type="submit" disabled={isSubmitting} className="w-full mt-5">
        {isSubmitting ? <Spinner /> : isSignUp ? 'Sign Up' : 'Sign In'}
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
          ? 'Already have an account? Sign In'
          : "Don't have an account? Sign Up"}
      </Button>
    </form>
  );
};
