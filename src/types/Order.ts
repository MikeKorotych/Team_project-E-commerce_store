export type Order = {
  id: string,
  createdAt: string,
  status: boolean,
  totalPrice: string,
  shippingAddress: string
}

export type OrderItem = {
  id: string,
  orderId: string,
  productId: string,
  quantity: number,
  priceAtPurchase: number,
  userId: number,
  createdAt: string
}