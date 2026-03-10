export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  category: string;
  price: number;
  sale_price: number | null;
  description: string;
  fabric_info: string;
  stock_count: number;
  images: string[];
  colors: string[];
  sizes: string[];
  tags: string[];
  status: string;
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface Order {
  id: number;
  order_id: string;
  customer_name: string;
  phone: string;
  division: string;
  district: string;
  address: string;
  note?: string;
  items: CartItem[];
  subtotal: number;
  delivery_charge: number;
  total: number;
  status: string;
  created_at: string;
}
