export type Order = {
  id: string;
  created_at: string;
  user_id: number;
  status: boolean;
  total_price: string;
  shipping_address: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  product_img: string;
};