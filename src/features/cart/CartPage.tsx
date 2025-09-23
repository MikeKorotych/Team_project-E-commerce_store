import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import CartItem from "@/components/CartItem";
import { useCartStore } from "./cartStore";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import React from "react"; // Import React to use createRef
import { toast } from "sonner";

export const CartPage = () => {
  const { items } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (totalItems === 0) {
      toast.error("No items in the cart...");
    } else {
      navigate("/checkout");
    }
  };
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.priceDiscount * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="mb-10 max-sm:mb-6 flex flex-row gap-2 items-center">
        <ChevronLeft className="w-4 h-4" />
        <Link to="/" className="text-[#F1F2F9] text-xs mt-0.5">
          Back to shop
        </Link>
      </div>

      <h1 className="page-title">Cart</h1>

      <div className="flex flex-col xl:flex-row gap-8 lg:gap-4 mt-10 max-lg:items-center">
        <TransitionGroup className="w-full flex flex-col items-center mx-auto">
          {" "}
          {/* Removed gap-4 */}
          {items.map((item) => {
            const nodeRef = React.createRef<HTMLDivElement>();
            return (
              <CSSTransition
                key={item.product.id}
                nodeRef={nodeRef}
                timeout={300}
                classNames="cart-item"
              >
                {/* Added margin to each item instead of gap on the container */}
                <div
                  ref={nodeRef}
                  className="cart-item-wrapper mb-4 last:mb-0 max-sm:w-full xl:w-full"
                >
                  <CartItem item={item} />
                </div>
              </CSSTransition>
            );
          })}
        </TransitionGroup>

        {/* Total amount */}
        <div className="w-full max-w-[592px] xl:max-w-[368px] flex flex-col min-h-[190px] max-h-[206px] border shadow-sm justify-center items-center p-[24px] mx-auto">
          <div className="flex flex-col items-center">
            <span className="font-bold text-[32px]/[41px]">${totalPrice}</span>
            <span className="text-dark text-sm/[21px]">
              Total for {totalItems} items
            </span>
          </div>
          <div className="w-full max-w-[544px] border-t border-[#3B3E4A] my-4" />
          <Button
            className="w-full max-w-[544px] py-5"
            onClick={handleCheckout}
            disabled={totalItems === 0}
          >
            Checkout
          </Button>
        </div>
      </div>
    </>
  );
};
