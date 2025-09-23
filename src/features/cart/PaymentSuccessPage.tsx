import { useEffect } from "react";
import { Link } from "react-router";
import { useCartStore } from "./cartStore";
import { CheckCircle } from "lucide-react";

export const PaymentSuccessPage = () => {
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex flex-col items-center justify-center text-center h-full py-20">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-gray-400 mb-6">
        Thank you for your purchase. Your order is being processed.
      </p>
      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Back to Home
      </Link>
    </div>
  );
};
