export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  image: string | null;
  images: string | null;
  stock: number;
  featured: boolean;
  active: boolean;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  stock: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingRegion: string;
  notes: string | null;
  qfNotes: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  invoiceUrl: string | null;
  subtotal: number;
  shippingCost: number;
  total: number;
  items?: OrderItem[];
  statusHistory?: StatusChange[];
  createdAt: string;
  updatedAt: string;
}

export interface StatusChange {
  id: string;
  fromStatus: string;
  toStatus: string;
  note: string | null;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  productId: string;
  product?: Product;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type OrderStatus = "pendiente" | "confirmado" | "preparacion" | "despachado" | "entregado" | "cancelado";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  preparacion: "En Preparación",
  despachado: "Despachado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  confirmado: "bg-blue-100 text-blue-800",
  preparacion: "bg-orange-100 text-orange-800",
  despachado: "bg-purple-100 text-purple-800",
  entregado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};
