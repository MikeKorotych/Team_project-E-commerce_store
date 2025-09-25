import type { OrderItem } from "@/types/Order";
import { Link } from "react-router";

type Props = {
  orderItem: OrderItem;
};

export const OrderItemProps = ({ orderItem }: Props) => {
  return (
    <tr>
      <td className="px-7 py-2 border-l align-middle">
        <img
          src={orderItem.product_img}
          alt="Product"
          className="h-32 w-32 object-contain"
        />
      </td>
      <td className="px-7 py-2 border-l align-middle">
        <h2 className="text-[20px]/[21px] ">
          <Link to={`/product/${orderItem.product_id}`} className="hover:bg-muted">
            {orderItem.product_id}
          </Link>
        </h2>
      </td>
      <td className="px-7 py-2 border-l align-middle">
        <h2 className="font-bold text-[22px]/[140%]">{orderItem.quantity}</h2>
      </td>
      <td className="px-7 py-2 border-l align-middle">
        <h2 className="font-bold text-[22px]/[140%]">${orderItem.price_at_purchase}</h2>
      </td>
    </tr>
  );
};
