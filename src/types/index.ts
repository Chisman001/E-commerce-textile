export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  categoryId: number;
  images: string[] | null;
  stockQuantity: number;
  material: string | null;
  pattern: string | null;
  color: string | null;
  unit: string | null;
  isFeatured: boolean | null;
  isActive: boolean | null;
  createdAt: Date;
  category?: Category;
};

export type Order = {
  id: number;
  clerkUserId: string;
  status: string;
  totalAmount: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  phone: string;
  paymentReference: string | null;
  paymentStatus: string | null;
  createdAt: Date;
  items?: OrderItem[];
};

export type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  product?: Product;
};

export type Profile = {
  id: number;
  clerkUserId: string;
  fullName: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  createdAt: Date;
};

export type CartItem = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  unit: string;
  quantity: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
