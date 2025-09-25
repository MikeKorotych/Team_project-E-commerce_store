export interface Profile {
  id: string;
  updated_at?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  shippingAddress: string,
  stripeCustomerId: string,
  user_ava: string,
}