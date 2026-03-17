export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  BOLETO = "BOLETO",
  PIX = "PIX",
  PAYPAL = "PAYPAL",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum ShipmentStatus {
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  LOST = "LOST",
  RETURNED = "RETURNED",
}

export enum ShipmentService {
  STANDARD = "STANDARD",
  EXPRESS = "EXPRESS",
  PRIORITY = "PRIORITY",
}

export enum CouponType {
  PERCENTAGE = "PERCENTAGE",
  FIXED_AMOUNT = "FIXED_AMOUNT",
}

export enum VariantAttribute {
  COLOR = "COLOR",
  SIZE = "SIZE",
  MATERIAL = "MATERIAL",
  WEIGHT = "WEIGHT",
  CAPACITY = "CAPACITY",
}

export enum WarrantyStatus {
  ACTIVE = "ACTIVE",
  CLAIMED = "CLAIMED",
  EXPIRED = "EXPIRED",
}

export enum AddressType {
  SHIPPING = "SHIPPING",
  BILLING = "BILLING",
}

export enum ReturnStatus {
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

export enum ReturnType {
  FULL = "FULL",
  PARTIAL = "PARTIAL",
}

export enum TicketStatus {
  OPEN = "OPEN",
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum SupportChannel {
  EMAIL = "EMAIL",
  CHAT = "CHAT",
  PHONE = "PHONE",
  SOCIAL = "SOCIAL",
}

export enum MovementType {
  IN = "IN",
  OUT = "OUT",
  ADJUSTMENT = "ADJUSTMENT",
}
