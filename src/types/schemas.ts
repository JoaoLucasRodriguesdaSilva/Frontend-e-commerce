import {
  AddressType,
  CouponType,
  MovementType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ReturnStatus,
  ReturnType,
  ShipmentService,
  ShipmentStatus,
  SupportChannel,
  TicketStatus,
  VariantAttribute,
  WarrantyStatus,
} from "./enums";

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  taxId: string;
  phone: string;
  birthDate: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  email: string;
  name: string;
}

// ─── Customer ────────────────────────────────────────────────────────────────

export interface CustomerRequest {
  name: string;
  email: string;
  taxId: string;
  phone: string;
  birthDate: string;
}

export interface CustomerResponse {
  id: number;
  name: string;
  email: string;
  taxId: string;
  phone: string;
  birthDate: string;
  createdAt: string;
}

// ─── Address ─────────────────────────────────────────────────────────────────

export interface AddressRequest {
  customerId: number;
  type: AddressType;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface AddressResponse {
  id: number;
  customerId: number;
  type: AddressType;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  isDefault: boolean;
}

// ─── Session ─────────────────────────────────────────────────────────────────

export interface SessionRequest {
  customerId: number;
  token: string;
  expiresAt: string;
  ip: string;
  userAgent: string;
}

export interface SessionResponse {
  id: number;
  customerId: number;
  token: string;
  expiresAt: string;
  ip: string;
  userAgent: string;
}

// ─── Saved Card Token ─────────────────────────────────────────────────────────

export interface SavedCardTokenRequest {
  customerId: number;
  last4Digits: string;
  brand: string;
  gatewayToken: string;
  expiration: string;
}

export interface SavedCardTokenResponse {
  id: number;
  customerId: number;
  last4Digits: string;
  brand: string;
  gatewayToken: string;
  expiration: string;
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface CategoryRequest {
  name: string;
  slug: string;
  parentCategoryId?: number;
  icon: string;
  displayOrder: number;
}

export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  parentCategoryId?: number;
  icon: string;
  displayOrder: number;
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface ProductRequest {
  name: string;
  description: string;
  technicalDescription: string;
  basePrice: number;
  promotionalPrice?: number;
  sku: string;
  brand: string;
  model: string;
  warrantyMonths: number;
  weight: number;
  dimensions: string;
  active: boolean;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  technicalDescription: string;
  basePrice: number;
  promotionalPrice?: number;
  sku: string;
  brand: string;
  model: string;
  warrantyMonths: number;
  weight: number;
  dimensions: string;
  active: boolean;
  createdAt: string;
}

// ─── Variant ──────────────────────────────────────────────────────────────────

export interface VariantRequest {
  productId: number;
  attribute: VariantAttribute;
  value: string;
  extraPrice: number;
  variantSku: string;
}

export interface VariantResponse {
  id: number;
  productId: number;
  attribute: VariantAttribute;
  value: string;
  extraPrice: number;
  variantSku: string;
}

// ─── Product Image ────────────────────────────────────────────────────────────

export interface ProductImageRequest {
  productId: number;
  url: string;
  alt: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductImageResponse {
  id: number;
  productId: number;
  url: string;
  alt: string;
  displayOrder: number;
  isPrimary: boolean;
}

// ─── Technical Specification ──────────────────────────────────────────────────

export interface TechnicalSpecificationRequest {
  productId: number;
  specKey: string;
  value: string;
}

export interface TechnicalSpecificationResponse {
  id: number;
  productId: number;
  specKey: string;
  value: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartRequest {
  customerId: number;
}

export interface CartResponse {
  id: number;
  customerId: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Cart Item ────────────────────────────────────────────────────────────────

export interface CartItemRequest {
  cartId: number;
  variantId: number;
  quantity: number;
  unitPrice: number;
}

export interface CartItemResponse {
  id: number;
  cartId: number;
  variantId: number;
  quantity: number;
  unitPrice: number;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface OrderRequest {
  customerId: number;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export interface OrderResponse {
  id: number;
  customerId: number;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  createdAt: string;
}

// ─── Order Item ───────────────────────────────────────────────────────────────

export interface OrderItemRequest {
  orderId: number;
  variantId: number;
  quantity: number;
  unitPrice: number;
  nameSnapshot: string;
  skuSnapshot: string;
}

export interface OrderItemResponse {
  id: number;
  orderId: number;
  variantId: number;
  quantity: number;
  unitPrice: number;
  nameSnapshot: string;
  skuSnapshot: string;
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export interface PaymentRequest {
  orderId: number;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  installments: number;
  gateway: string;
  gatewayTransactionId: string;
  paidAt?: string;
}

export interface PaymentResponse {
  id: number;
  orderId: number;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  installments: number;
  gateway: string;
  gatewayTransactionId: string;
  paidAt?: string;
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export interface InventoryRequest {
  variantId: number;
  quantity: number;
  reservedQuantity: number;
  reorderPoint: number;
}

export interface InventoryResponse {
  id: number;
  variantId: number;
  quantity: number;
  reservedQuantity: number;
  reorderPoint: number;
}

// ─── Inventory Movement ───────────────────────────────────────────────────────

export interface InventoryMovementRequest {
  variantId: number;
  type: MovementType;
  quantity: number;
  reason: string;
}

export interface InventoryMovementResponse {
  id: number;
  variantId: number;
  type: MovementType;
  quantity: number;
  reason: string;
  createdAt: string;
}

// ─── Shipment ─────────────────────────────────────────────────────────────────

export interface ShipmentRequest {
  orderId: number;
  carrier: string;
  service: ShipmentService;
  trackingCode: string;
  status: ShipmentStatus;
  cost: number;
  estimatedDays: number;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface ShipmentResponse {
  id: number;
  orderId: number;
  carrier: string;
  service: ShipmentService;
  trackingCode: string;
  status: ShipmentStatus;
  cost: number;
  estimatedDays: number;
  shippedAt?: string;
  deliveredAt?: string;
}

// ─── Coupon ───────────────────────────────────────────────────────────────────

export interface CouponRequest {
  code: string;
  type: CouponType;
  value: number;
  maxUsage: number;
  currentUsage: number;
  expiresAt: string;
  minimumOrder: number;
}

export interface CouponResponse {
  id: number;
  code: string;
  type: CouponType;
  value: number;
  maxUsage: number;
  currentUsage: number;
  expiresAt: string;
  minimumOrder: number;
}

export interface CouponApplyRequest {
  code: string;
  productId: number;
}

export interface CouponApplyResponse {
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
}

// ─── Promotion ────────────────────────────────────────────────────────────────

export interface PromotionRequest {
  productId: number;
  promotionalPrice: number;
  startsAt: string;
  endsAt: string;
  featuredHome: boolean;
}

export interface PromotionResponse {
  id: number;
  productId: number;
  promotionalPrice: number;
  startsAt: string;
  endsAt: string;
  featuredHome: boolean;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface ReviewRequest {
  productId: number;
  customerId: number;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface ReviewResponse {
  id: number;
  productId: number;
  customerId: number;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

// ─── Support Ticket ───────────────────────────────────────────────────────────

export interface SupportTicketRequest {
  customerId: number;
  orderId?: number;
  subject: string;
  status: TicketStatus;
  channel: SupportChannel;
}

export interface SupportTicketResponse {
  id: number;
  customerId: number;
  orderId?: number;
  subject: string;
  status: TicketStatus;
  channel: SupportChannel;
  createdAt: string;
}

// ─── Order Return ─────────────────────────────────────────────────────────────

export interface OrderReturnRequest {
  orderId: number;
  reason: string;
  status: ReturnStatus;
  type: ReturnType;
  approvedAt?: string;
}

export interface OrderReturnResponse {
  id: number;
  orderId: number;
  reason: string;
  status: ReturnStatus;
  type: ReturnType;
  approvedAt?: string;
}

// ─── Warranty ─────────────────────────────────────────────────────────────────

export interface WarrantyRequest {
  orderItemId: number;
  serialNumber: string;
  startDate: string;
  endDate: string;
  status: WarrantyStatus;
}

export interface WarrantyResponse {
  id: number;
  orderItemId: number;
  serialNumber: string;
  startDate: string;
  endDate: string;
  status: WarrantyStatus;
}
