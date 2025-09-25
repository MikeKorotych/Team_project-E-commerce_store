import { useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import { Link, useSearchParams } from "react-router";
import { useCartStore } from "./cartStore";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { toast } from "sonner";

type Status = "loading" | "success" | "error" | "idle";

export const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | number | null>(null);
  const hasProcessed = useRef(false);

  const { clearCart } = useCartStore();

  useEffect(() => {
    const processOrder = async () => {
      try {
        // get current user (may be null for guest)
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Если пользователь - гость, просто очищаем корзину и показываем успех
        if (!user) {
          console.log("Guest checkout: clearing cart without saving order.");
          await clearCart();
          setStatus("success");
          toast.success("Thank you for your purchase!");

          // Убираем параметры из URL, чтобы избежать повторной обработки при обновлении
          try {
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          } catch (e) {
            // ignore
          }
          return; // Завершаем выполнение для гостя
        }

        // Ensure cart is hydrated from DB/localStorage before reading items
        const fetchCart = useCartStore.getState().fetchCart;
        if (fetchCart) {
          await fetchCart();
        }
        const currentCartItems = useCartStore.getState().items;

        // If cart empty, just show success
        if (!currentCartItems || currentCartItems.length === 0) {
          setStatus("success");
          return;
        }

        // calculate total
        const totalPrice = currentCartItems.reduce(
          (sum, item) => sum + item.product.priceDiscount * item.quantity,
          0
        );

        // try to fetch profile shipping address if user exists
        let shippingAddress = "No address provided";
        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("default_shipping_address")
            .eq("id", user.id)
            .single();
          if (!profileError && profileData) {
            shippingAddress =
              profileData.default_shipping_address || shippingAddress;
          }
        }

        // create order
        const orderPayload: Record<string, any> = {
          total_price: totalPrice,
          status: "succeeded",
          shipping_address: shippingAddress,
        };
        if (user && user.id) {
          orderPayload.user_id = user.id;
        } else {
          console.debug("Creating guest order (no authenticated user)");
        }

        console.debug("Inserting order payload:", orderPayload);
        const orderRes = await supabase
          .from("orders")
          .insert(orderPayload)
          .select()
          .single();
        console.debug("Order insert response:", orderRes);
        const newOrder = orderRes.data as any;
        const orderError = orderRes.error;

        if (orderError) {
          console.error("Failed to create order:", orderError, orderRes);
          throw orderError;
        }

        if (!newOrder || !newOrder.id) {
          console.error("Order creation returned no id", orderRes);
          throw new Error("Order creation returned no id");
        }

        // prepare order items
        const orderItemsToInsert = currentCartItems.map((item) => ({
          order_id: newOrder.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price_at_purchase: item.product.priceDiscount,
          product_img: item.product.images[0],
        }));

        console.debug("Inserting order_items payload:", orderItemsToInsert);
        const orderItemsRes = await supabase
          .from("order_items")
          .insert(orderItemsToInsert);
        console.debug("Order_items insert response:", orderItemsRes);
        const orderItemsError = orderItemsRes.error;
        if (orderItemsError) {
          console.error(
            "Failed to insert order_items:",
            orderItemsError,
            orderItemsRes
          );
          throw orderItemsError;
        }

        // clear cart locally and in DB
        await clearCart();

        // store order id for UI
        setOrderId(newOrder.id);

        setStatus("success");
        toast.success("Your order has been saved successfully!");

        // remove query params so refresh won't re-trigger
        try {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        } catch (e) {
          // ignore
        }
      } catch (err: unknown) {
        console.error("Order processing failed:", err);
        const message = err instanceof Error ? err.message : String(err);
        setErrorMessage(message || "An unknown error occurred");
        setStatus("error");
        toast.error("Failed to save your order.");
      }
    };

    // Only process once and optionally check redirect status if present
    if (hasProcessed.current) return;

    const redirectStatus = searchParams.get("redirect_status");
    // If redirect status exists, respect it; otherwise attempt to process anyway
    if (!redirectStatus || redirectStatus === "succeeded") {
      hasProcessed.current = true;
      processOrder();
    } else if (redirectStatus === "failed") {
      hasProcessed.current = true;
      setErrorMessage("Payment failed or was canceled.");
      setStatus("error");
    } else {
      setStatus("idle");
    }
  }, [clearCart, searchParams]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full py-20">
        <Spinner />
        <h1 className="text-2xl font-bold mt-4">Processing your order...</h1>
        <p className="text-gray-400">Please do not close this page.</p>
      </div>
    );
  }

  const statusConfig: Record<
    Status,
    { icon: ReactNode; title: string; message: string }
  > = {
    success: {
      icon: <CheckCircle className="w-16 h-16 text-green-500 mb-4" />,
      title: "Payment Successful!",
      message: "Thank you for your purchase. Your order is being processed.",
    },
    error: {
      icon: <XCircle className="w-16 h-16 text-red-500 mb-4" />,
      title: "Order Processing Failed",
      message: errorMessage || "Something went wrong.",
    },
    idle: {
      icon: <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />,
      title: "Incomplete Payment Information",
      message: "Could not verify payment status.",
    },
    loading: {
      icon: <Spinner />,
      title: "",
      message: "",
    },
  };

  const { icon, title, message } = statusConfig[status];

  return (
    <div className="flex flex-col items-center justify-center text-center h-full py-20">
      {icon}
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-400 mb-6">{message}</p>
      {status === "success" && orderId && (
        <p className="text-gray-400 mb-4">
          Order ID: <span className="font-mono">{orderId}</span>
        </p>
      )}
      <Link
        to="/"
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded"
      >
        Back to Home
      </Link>
    </div>
  );
};
