import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { supabase } from "@/utils/supabase";
import { CheckoutForm } from "@/features/cart/CheckoutForm";
import { useCartStore } from "@/features/cart/cartStore";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { items } = useCartStore();
  const amount = items.reduce(
    (sum, item) => sum + item.product.priceDiscount * item.quantity,
    0
  );

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          "create-payment-intent",
          {
            body: { amount },
          }
        );

        if (error) throw error;

        setClientSecret(data.clientSecret);
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("Error fetching payment intent:", msg);
        // Здесь можно показать ошибку пользователю
      }
    };

    if (amount > 0) {
      fetchPaymentIntent();
    }
  }, [amount]);

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  const appearance = {
    labels: "floating" as const,
    variables: {
      colorPrimary: "#a78bfa",
      colorBackground: "#0f172a",
      colorText: "#f8fafc",
      colorTextSecondary: "#94a3b8",
      colorTextPlaceholder: "#64748b",
      colorIcon: "#94a3b8",
      colorDanger: "#ef4444",
      borderRadius: "0.375rem",
    },
    rules: {
      ".Tab": {
        border: "1px solid #334155", // slate-700
      },
      ".Tab:hover": {
        backgroundColor: "#1e293b", // slate-800
      },
      ".Tab--selected": {
        borderColor: "#334155", // slate-700
        backgroundColor: "#1e293b", // slate-800
      },
      ".Input": {
        backgroundColor: "#0f172a", // slate-900
        border: "1px solid #334155", // slate-700
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
        <CheckoutForm amount={amount} />
      </Elements>
    </div>
  );
};

export default CheckoutPage;
