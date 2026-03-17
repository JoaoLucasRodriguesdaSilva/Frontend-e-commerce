# Backend E-commerce API

REST API for a full-featured e-commerce platform, built with **Spring Boot 3.2**, **Spring Security (JWT)**, and **PostgreSQL**.

Interactive API documentation (Swagger UI) is available at `/swagger-ui.html` once the application is running.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [Enumerations](#enumerations)
- [Endpoints Reference](#endpoints-reference)
  - [Auth](#auth)
  - [Customer](#customer)
  - [Address](#address)
  - [Session](#session)
  - [Saved Card Token](#saved-card-token)
  - [Category](#category)
  - [Product](#product)
  - [Variant](#variant)
  - [Product Image](#product-image)
  - [Technical Specification](#technical-specification)
  - [Cart](#cart)
  - [Cart Item](#cart-item)
  - [Order](#order)
  - [Order Item](#order-item)
  - [Payment](#payment)
  - [Inventory](#inventory)
  - [Inventory Movement](#inventory-movement)
  - [Shipment](#shipment)
  - [Coupon](#coupon)
  - [Promotion](#promotion)
  - [Review](#review)
  - [Support Ticket](#support-ticket)
  - [Order Return](#order-return)
  - [Warranty](#warranty)

---

## Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.8+ |
| PostgreSQL | 14+ |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_URL` | JDBC URL, e.g. `jdbc:postgresql://localhost:5432/ecommerce` |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | 32-byte hex secret for signing JWTs (optional, has default) |
| `JWT_EXPIRATION_MS` | Token lifetime in milliseconds (default `86400000` = 24 h) |

### Running Locally

```bash
# Clone the repository
git clone https://github.com/JoaoLucasRodriguesdaSilva/Backend-e-commerce.git
cd Backend-e-commerce

# Set environment variables (example)
export DB_URL=jdbc:postgresql://localhost:5432/ecommerce
export DB_USERNAME=postgres
export DB_PASSWORD=postgres

# Build and run
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`.  
Swagger UI: `http://localhost:8080/swagger-ui.html`

---

## Authentication

The API uses **JWT Bearer tokens**.

### Flow

1. **Register** a new account → `POST /api/auth/register`
2. **Login** to receive a token → `POST /api/auth/login`
3. Include the token in every subsequent request:

```
Authorization: Bearer <token>
```

### Roles

| Role | Description |
|------|-------------|
| `USER` | Regular customer – can access `/my/**` endpoints for their own data |
| `ADMIN` | Full access to all endpoints |

### Public Endpoints (no token required)

| Method | Path |
|--------|------|
| `POST` | `/api/auth/register` |
| `POST` | `/api/auth/login` |
| `GET` | `/swagger-ui/**` |
| `GET` | `/v3/api-docs/**` |

---

## Enumerations

| Enum | Values |
|------|--------|
| `OrderStatus` | `PENDING` · `CONFIRMED` · `PROCESSING` · `SHIPPED` · `DELIVERED` · `CANCELLED` |
| `PaymentMethod` | `CREDIT_CARD` · `DEBIT_CARD` · `BOLETO` · `PIX` · `PAYPAL` |
| `PaymentStatus` | `PENDING` · `APPROVED` · `DENIED` · `CANCELLED` · `REFUNDED` |
| `ShipmentStatus` | `PENDING` · `SHIPPED` · `IN_TRANSIT` · `DELIVERED` · `LOST` · `RETURNED` |
| `ShipmentService` | `STANDARD` · `EXPRESS` · `PRIORITY` |
| `CouponType` | `PERCENTAGE` · `FIXED_AMOUNT` |
| `VariantAttribute` | `COLOR` · `SIZE` · `MATERIAL` · `WEIGHT` · `CAPACITY` |
| `WarrantyStatus` | `ACTIVE` · `CLAIMED` · `EXPIRED` |
| `AddressType` | `SHIPPING` · `BILLING` |
| `ReturnStatus` | `REQUESTED` · `APPROVED` · `REJECTED` · `COMPLETED` |
| `ReturnType` | `FULL` · `PARTIAL` |
| `TicketStatus` | `OPEN` · `PENDING` · `RESOLVED` · `CLOSED` |
| `SupportChannel` | `EMAIL` · `CHAT` · `PHONE` · `SOCIAL` |
| `MovementType` | `IN` · `OUT` · `ADJUSTMENT` |

---

## Endpoints Reference

> **Legend**
> - 🔓 No authentication required
> - 👤 `USER` or `ADMIN` role required
> - 🔒 `ADMIN` role required

---

### Auth

Base path: `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/register` | 🔓 | Register a new user account |
| `POST` | `/login` | 🔓 | Authenticate and receive a JWT token |

#### POST /api/auth/register

**Request body**

```json
{
  "name": "João Lucas",
  "email": "joao@example.com",
  "password": "secret123",
  "taxId": "123.456.789-00",
  "phone": "+55 11 91234-5678",
  "birthDate": "1995-07-20"
}
```

**Response `201 Created`**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "email": "joao@example.com",
  "name": "João Lucas"
}
```

#### POST /api/auth/login

**Request body**

```json
{
  "email": "joao@example.com",
  "password": "secret123"
}
```

**Response `200 OK`**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "email": "joao@example.com",
  "name": "João Lucas"
}
```

---

### Customer

Base path: `/api/customers`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/my` | 👤 | Get the authenticated user's customer profile |
| `POST` | `/my` | 👤 | Create customer profile for the authenticated user |
| `PUT` | `/my` | 👤 | Update the authenticated user's customer profile |
| `GET` | `` | 🔒 | List all customers |
| `GET` | `/{id}` | 🔒 | Get customer by ID |
| `POST` | `` | 🔒 | Create a customer |
| `PUT` | `/{id}` | 🔒 | Update a customer |
| `DELETE` | `/{id}` | 🔒 | Delete a customer |

**CustomerRequest / CustomerResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `name` | `String` | Full name |
| `email` | `String` | E-mail address |
| `taxId` | `String` | CPF / CNPJ |
| `phone` | `String` | Phone number |
| `birthDate` | `LocalDate` | Date of birth (`yyyy-MM-dd`) |
| `createdAt` | `LocalDateTime` | *(response only)* Creation timestamp |

---

### Address

Base path: `/api/addresses`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `` | 🔒 | List all addresses |
| `GET` | `/{id}` | 🔒 | Get address by ID |
| `POST` | `` | 🔒 | Create an address |
| `PUT` | `/{id}` | 🔒 | Update an address |
| `DELETE` | `/{id}` | 🔒 | Delete an address |

**AddressRequest / AddressResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `customerId` | `Long` | Owner customer ID |
| `type` | `AddressType` | `SHIPPING` or `BILLING` |
| `zipCode` | `String` | ZIP / postal code |
| `street` | `String` | Street name |
| `number` | `String` | Street number |
| `complement` | `String` | Apt, suite, unit (optional) |
| `neighborhood` | `String` | Neighborhood / district |
| `city` | `String` | City |
| `state` | `String` | State (2-letter code) |
| `isDefault` | `Boolean` | Default address for this type |

---

### Session

Base path: `/api/sessions`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `` | 🔒 | List all sessions |
| `GET` | `/{id}` | 🔒 | Get session by ID |
| `POST` | `` | 🔒 | Create a session |
| `PUT` | `/{id}` | 🔒 | Update a session |
| `DELETE` | `/{id}` | 🔒 | Delete a session |

**SessionRequest / SessionResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `customerId` | `Long` | Owner customer ID |
| `token` | `String` | Unique session token |
| `expiresAt` | `LocalDateTime` | Expiry timestamp |
| `ip` | `String` | Client IP address |
| `userAgent` | `String` | Client User-Agent string |

---

### Saved Card Token

Base path: `/api/saved-card-tokens`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `` | 🔒 | List all saved card tokens |
| `GET` | `/{id}` | 🔒 | Get saved card token by ID |
| `POST` | `` | 🔒 | Save a card token |
| `PUT` | `/{id}` | 🔒 | Update a saved card token |
| `DELETE` | `/{id}` | 🔒 | Delete a saved card token |

**SavedCardTokenRequest / SavedCardTokenResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `customerId` | `Long` | Owner customer ID |
| `last4Digits` | `String` | Last 4 digits of the card |
| `brand` | `String` | Card brand (e.g. `Visa`) |
| `gatewayToken` | `String` | Gateway tokenized reference |
| `expiration` | `String` | Expiry in `MM/YY` format |

---

### Category

Base path: `/api/categories`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `` | 👤 | List all categories |
| `GET` | `/{id}` | 👤 | Get category by ID |
| `POST` | `` | 🔒 | Create a category |
| `PUT` | `/{id}` | 🔒 | Update a category |
| `DELETE` | `/{id}` | 🔒 | Delete a category |

**CategoryRequest / CategoryResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `name` | `String` | Display name |
| `slug` | `String` | URL-friendly unique slug |
| `parentCategoryId` | `Long` | Parent category ID (null for top-level) |
| `icon` | `String` | Icon identifier or URL |
| `displayOrder` | `Integer` | Sort order |

---

### Product

Base path: `/api/products`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `` | 👤 | List all products |
| `GET` | `/{id}` | 👤 | Get product by ID |
| `POST` | `` | 🔒 | Create a product |
| `PUT` | `/{id}` | 🔒 | Update a product |
| `DELETE` | `/{id}` | 🔒 | Delete a product |

**ProductRequest / ProductResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `name` | `String` | Product name |
| `description` | `String` | Short marketing description |
| `technicalDescription` | `String` | Detailed technical description |
| `basePrice` | `BigDecimal` | Regular list price |
| `promotionalPrice` | `BigDecimal` | Active promotional price (nullable) |
| `sku` | `String` | Unique stock-keeping unit code |
| `brand` | `String` | Brand name |
| `model` | `String` | Model identifier |
| `warrantyMonths` | `Integer` | Warranty duration in months |
| `weight` | `BigDecimal` | Weight in kg |
| `dimensions` | `String` | Dimensions string (e.g. `20x18x8 cm`) |
| `active` | `Boolean` | Whether the product is visible |
| `createdAt` | `LocalDateTime` | *(response only)* Creation timestamp |

---

### Variant

Base path: `/api/variants`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `` | 👤 | List all variants |
| `GET` | `/{id}` | 👤 | Get variant by ID |
| `POST` | `` | 🔒 | Create a variant |
| `PUT` | `/{id}` | 🔒 | Update a variant |
| `DELETE` | `/{id}` | 🔒 | Delete a variant |

**VariantRequest / VariantResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `productId` | `Long` | Parent product ID |
| `attribute` | `VariantAttribute` | Attribute type (`COLOR`, `SIZE`, `MATERIAL`, `WEIGHT`, `CAPACITY`) |
| `value` | `String` | Attribute value (e.g. `Space Gray`) |
| `extraPrice` | `BigDecimal` | Price delta on top of the base price |
| `variantSku` | `String` | Unique SKU for this variant |

---

### Product Image

Base path: `/api/images`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `` | 👤 | List all product images |
| `GET` | `/{id}` | 👤 | Get product image by ID |
| `POST` | `` | 🔒 | Add a product image |
| `PUT` | `/{id}` | 🔒 | Update a product image |
| `DELETE` | `/{id}` | 🔒 | Delete a product image |

**ProductImageRequest / ProductImageResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `productId` | `Long` | Parent product ID |
| `url` | `String` | Public image URL |
| `alt` | `String` | Alt text for accessibility / SEO |
| `displayOrder` | `Integer` | Gallery sort order |
| `isPrimary` | `Boolean` | Whether this is the thumbnail image |

---

### Technical Specification

Base path: `/api/technical-specifications`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `` | 👤 | List all technical specifications |
| `GET` | `/{id}` | 👤 | Get specification by ID |
| `POST` | `` | 🔒 | Add a technical specification |
| `PUT` | `/{id}` | 🔒 | Update a technical specification |
| `DELETE` | `/{id}` | 🔒 | Delete a technical specification |

**TechnicalSpecificationRequest / TechnicalSpecificationResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `productId` | `Long` | Parent product ID |
| `specKey` | `String` | Attribute key (e.g. `Connectivity`) |
| `value` | `String` | Attribute value (e.g. `Bluetooth 5.3`) |

---

### Cart

Base path: `/api/carts`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `` | 🔒 | List all carts |
| `GET` | `/{id}` | 🔒 | Get cart by ID |
| `POST` | `` | 🔒 | Create a cart |
| `PUT` | `/{id}` | 🔒 | Update a cart |
| `DELETE` | `/{id}` | 🔒 | Delete a cart |

**CartRequest / CartResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `customerId` | `Long` | Owner customer ID |
| `createdAt` | `LocalDateTime` | *(response only)* Creation timestamp |
| `updatedAt` | `LocalDateTime` | *(response only)* Last update timestamp |

---

### Cart Item

Base path: `/api/cart-items`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `` | 🔒 | List all cart items |
| `GET` | `/{id}` | 🔒 | Get cart item by ID |
| `POST` | `` | 🔒 | Add item to cart |
| `PUT` | `/{id}` | 🔒 | Update cart item |
| `DELETE` | `/{id}` | 🔒 | Remove item from cart |

**CartItemRequest / CartItemResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `cartId` | `Long` | Parent cart ID |
| `variantId` | `Long` | Product variant ID |
| `quantity` | `Integer` | Quantity in cart |
| `unitPrice` | `BigDecimal` | Price at time of adding |

---

### Order

Base path: `/api/orders`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/my` | 👤 | List the authenticated user's orders |
| `GET` | `/my/{id}` | 👤 | Get a specific order of the authenticated user |
| `GET` | `` | 🔒 | List all orders |
| `GET` | `/{id}` | 🔒 | Get order by ID |
| `POST` | `` | 🔒 | Create an order |
| `PUT` | `/{id}` | 🔒 | Update an order |
| `DELETE` | `/{id}` | 🔒 | Delete an order |

**OrderRequest / OrderResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `customerId` | `Long` | Customer who placed the order |
| `status` | `OrderStatus` | Current order status |
| `subtotal` | `BigDecimal` | Sum of item prices |
| `discount` | `BigDecimal` | Applied discount amount |
| `shipping` | `BigDecimal` | Shipping cost |
| `total` | `BigDecimal` | Final total (subtotal − discount + shipping) |
| `createdAt` | `LocalDateTime` | *(response only)* Creation timestamp |

---

### Order Item

Base path: `/api/order-items`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/my` | 👤 | List items of the authenticated user's orders |
| `GET` | `/my/{id}` | 👤 | Get a specific order item |
| `GET` | `` | 🔒 | List all order items |
| `GET` | `/{id}` | 🔒 | Get order item by ID |
| `POST` | `` | 🔒 | Create an order item |
| `PUT` | `/{id}` | 🔒 | Update an order item |
| `DELETE` | `/{id}` | 🔒 | Delete an order item |

**OrderItemRequest / OrderItemResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `orderId` | `Long` | Parent order ID |
| `variantId` | `Long` | Product variant ID |
| `quantity` | `Integer` | Quantity ordered |
| `unitPrice` | `BigDecimal` | Unit price captured at purchase time |
| `nameSnapshot` | `String` | Product name snapshot |
| `skuSnapshot` | `String` | Variant SKU snapshot |

---

### Payment

Base path: `/api/payments`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/my` | 👤 | List the authenticated user's payments |
| `GET` | `/my/{id}` | 👤 | Get a specific payment of the authenticated user |
| `POST` | `/my` | 👤 | Create a payment for the authenticated user |
| `GET` | `` | 🔒 | List all payments |
| `GET` | `/{id}` | 🔒 | Get payment by ID |
| `POST` | `` | 🔒 | Create a payment |
| `PUT` | `/{id}` | 🔒 | Update a payment |
| `DELETE` | `/{id}` | 🔒 | Delete a payment |

**PaymentRequest / PaymentResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `orderId` | `Long` | Associated order ID |
| `method` | `PaymentMethod` | Payment method |
| `status` | `PaymentStatus` | Payment status |
| `amount` | `BigDecimal` | Payment amount |
| `installments` | `Integer` | Number of installments |
| `gateway` | `String` | Gateway identifier (e.g. `stripe`) |
| `gatewayTransactionId` | `String` | Gateway transaction reference |
| `paidAt` | `LocalDateTime` | Confirmation timestamp |

---

### Inventory

Base path: `/api/inventories`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `` | 🔒 | List all inventory records |
| `GET` | `/{id}` | 🔒 | Get inventory record by ID |
| `POST` | `` | 🔒 | Create an inventory record |
| `PUT` | `/{id}` | 🔒 | Update an inventory record |
| `DELETE` | `/{id}` | 🔒 | Delete an inventory record |

**InventoryRequest / InventoryResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `variantId` | `Long` | Associated variant ID |
| `quantity` | `Integer` | Total stock on hand |
| `reservedQuantity` | `Integer` | Reserved for pending orders |
| `reorderPoint` | `Integer` | Minimum threshold triggering reorder |

---

### Inventory Movement

Base path: `/api/inventory-movements`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `` | 🔒 | List all inventory movements |
| `GET` | `/{id}` | 🔒 | Get movement by ID |
| `POST` | `` | 🔒 | Record an inventory movement |
| `PUT` | `/{id}` | 🔒 | Update an inventory movement |
| `DELETE` | `/{id}` | 🔒 | Delete an inventory movement |

**InventoryMovementRequest / InventoryMovementResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `variantId` | `Long` | Affected variant ID |
| `type` | `MovementType` | `IN`, `OUT`, or `ADJUSTMENT` |
| `quantity` | `Integer` | Quantity moved |
| `reason` | `String` | Reason or reference |
| `createdAt` | `LocalDateTime` | *(response only)* Recording timestamp |

---

### Shipment

Base path: `/api/shipments`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/my` | 👤 | List the authenticated user's shipments |
| `GET` | `/my/{id}` | 👤 | Get a specific shipment of the authenticated user |
| `GET` | `` | 🔒 | List all shipments |
| `GET` | `/{id}` | 🔒 | Get shipment by ID |
| `POST` | `` | 🔒 | Create a shipment |
| `PUT` | `/{id}` | 🔒 | Update a shipment |
| `DELETE` | `/{id}` | 🔒 | Delete a shipment |

**ShipmentRequest / ShipmentResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `orderId` | `Long` | Associated order ID |
| `carrier` | `String` | Carrier name (e.g. `FedEx`) |
| `service` | `ShipmentService` | `STANDARD`, `EXPRESS`, or `PRIORITY` |
| `trackingCode` | `String` | Carrier tracking code |
| `status` | `ShipmentStatus` | Current shipment status |
| `cost` | `BigDecimal` | Shipping cost |
| `estimatedDays` | `Integer` | Estimated delivery days |
| `shippedAt` | `LocalDateTime` | Dispatch timestamp |
| `deliveredAt` | `LocalDateTime` | Delivery timestamp |

---

### Coupon

Base path: `/api/coupons`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `` | 👤 | List all coupons |
| `GET` | `/{id}` | 👤 | Get coupon by ID |
| `POST` | `/apply` | 👤 | Apply a coupon code to a product price |
| `POST` | `` | 🔒 | Create a coupon |
| `PUT` | `/{id}` | 🔒 | Update a coupon |
| `DELETE` | `/{id}` | 🔒 | Delete a coupon |

**CouponRequest / CouponResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `code` | `String` | Unique coupon code |
| `type` | `CouponType` | `PERCENTAGE` or `FIXED_AMOUNT` |
| `value` | `BigDecimal` | Discount value |
| `maxUsage` | `Integer` | Maximum redemptions allowed |
| `currentUsage` | `Integer` | Redemptions so far |
| `expiresAt` | `LocalDateTime` | Expiry timestamp |
| `minimumOrder` | `BigDecimal` | Minimum order amount required |

#### POST /api/coupons/apply

**Request body**

```json
{
  "code": "SAVE10",
  "productId": 1
}
```

**Response `200 OK`**

```json
{
  "originalPrice": 249.99,
  "discountAmount": 25.00,
  "finalPrice": 224.99
}
```

---

### Promotion

Base path: `/api/promotions`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `` | 👤 | List all promotions |
| `GET` | `/{id}` | 👤 | Get promotion by ID |
| `POST` | `` | 🔒 | Create a promotion |
| `PUT` | `/{id}` | 🔒 | Update a promotion |
| `DELETE` | `/{id}` | 🔒 | Delete a promotion |

**PromotionRequest / PromotionResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `productId` | `Long` | Promoted product ID |
| `promotionalPrice` | `BigDecimal` | Sale price during the promotion |
| `startsAt` | `LocalDateTime` | Promotion start |
| `endsAt` | `LocalDateTime` | Promotion end |
| `featuredHome` | `Boolean` | Whether to show on home page |

---

### Review

Base path: `/api/reviews`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/my` | 👤 | Submit a review as the authenticated user |
| `PUT` | `/my/{id}` | 👤 | Update own review |
| `GET` | `` | 👤 | List all reviews |
| `GET` | `/{id}` | 👤 | Get review by ID |
| `POST` | `` | 🔒 | Create a review |
| `PUT` | `/{id}` | 🔒 | Update a review |
| `DELETE` | `/{id}` | 🔒 | Delete a review |

**ReviewRequest / ReviewResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `productId` | `Long` | Reviewed product ID |
| `customerId` | `Long` | Reviewer customer ID |
| `rating` | `Integer` | 1 (worst) – 5 (best) |
| `title` | `String` | Short review title |
| `comment` | `String` | Detailed review text |
| `verifiedPurchase` | `Boolean` | Confirmed purchase flag |
| `createdAt` | `LocalDateTime` | *(response only)* Submission timestamp |

---

### Support Ticket

Base path: `/api/support-tickets`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/my` | 👤 | List the authenticated user's tickets |
| `GET` | `/my/{id}` | 👤 | Get a specific ticket of the authenticated user |
| `POST` | `/my` | 👤 | Open a support ticket |
| `DELETE` | `/my/{id}` | 👤 | Delete own ticket |
| `GET` | `` | 🔒 | List all support tickets |
| `GET` | `/{id}` | 🔒 | Get ticket by ID |
| `POST` | `` | 🔒 | Create a support ticket |
| `PUT` | `/{id}` | 🔒 | Update a support ticket |
| `DELETE` | `/{id}` | 🔒 | Delete a support ticket |

**SupportTicketRequest / SupportTicketResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `customerId` | `Long` | Customer who opened the ticket |
| `orderId` | `Long` | Related order ID (optional) |
| `subject` | `String` | Issue description |
| `status` | `TicketStatus` | Ticket status |
| `channel` | `SupportChannel` | Contact channel |
| `createdAt` | `LocalDateTime` | *(response only)* Open timestamp |

---

### Order Return

Base path: `/api/order-returns`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/my` | 👤 | List the authenticated user's return requests |
| `POST` | `/my` | 👤 | Submit a return request |
| `GET` | `` | 🔒 | List all return requests |
| `GET` | `/{id}` | 🔒 | Get return request by ID |
| `POST` | `` | 🔒 | Create a return request |
| `PUT` | `/{id}` | 🔒 | Update a return request |
| `DELETE` | `/{id}` | 🔒 | Delete a return request |

**OrderReturnRequest / OrderReturnResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `orderId` | `Long` | Associated order ID |
| `reason` | `String` | Reason for the return |
| `status` | `ReturnStatus` | Current return status |
| `type` | `ReturnType` | `FULL` or `PARTIAL` return |
| `approvedAt` | `LocalDateTime` | Approval timestamp (nullable) |

---

### Warranty

Base path: `/api/warranties`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `` | 👤 | List all warranties |
| `GET` | `/{id}` | 👤 | Get warranty by ID |
| `POST` | `` | 🔒 | Create a warranty record |
| `PUT` | `/{id}` | 🔒 | Update a warranty record |
| `DELETE` | `/{id}` | 🔒 | Delete a warranty record |

**WarrantyRequest / WarrantyResponse fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Long` | *(response only)* Unique identifier |
| `orderItemId` | `Long` | Associated order item ID |
| `serialNumber` | `String` | Product serial number |
| `startDate` | `LocalDate` | Warranty start (`yyyy-MM-dd`) |
| `endDate` | `LocalDate` | Warranty end (`yyyy-MM-dd`) |
| `status` | `WarrantyStatus` | `ACTIVE`, `CLAIMED`, or `EXPIRED` |

---

## Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200 OK` | Request succeeded |
| `201 Created` | Resource created successfully |
| `204 No Content` | Resource deleted successfully |
| `400 Bad Request` | Invalid request data / validation error |
| `401 Unauthorized` | Missing or invalid JWT token |
| `403 Forbidden` | Insufficient permissions |
| `404 Not Found` | Resource not found |
| `409 Conflict` | Resource already exists (e.g. duplicate e-mail) |

---

## License

[MIT](https://opensource.org/licenses/MIT)

