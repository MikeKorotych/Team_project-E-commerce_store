export interface Profile {
  id: string;
  updated_at?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  shipping_address: string,
  stripe_customer_id: string,
  user_ava: string,
}