// Core Types for the Application

export interface User {
  id: string;
  e_mail_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  isVerified: boolean;
}

export interface Product {
  SKU: string;
  displayName: string;
  product_model: string;
  manufacturer: string;
  image: string;
  list_price: number;
  selling_price?: number;
  stock_quantity: number;
  supplier: string;
  category?: string;
  description?: string;
}

export interface CartItem {
  SKU: string;
  displayName: string;
  image: string;
  manufacturer: string;
  supplier: string;
  list_price: number;
  selling_price?: number;
  quantity: number;
  isWishlist: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
}

export interface Order {
  order_id: string;
  order_date: string;
  total_amount: number;
  status: string;
  items: CartItem[];
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
