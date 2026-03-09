// ── cart.model.ts ─────────────────────────────────────────────
// Interface ตรงกับ Prisma schema + response จาก cart.controller.js

// ── จาก Prisma model Product (include ใน getCart) ────────────
export interface Product {
  product_id:     number;
  category_id:    number;
  sku:            string;
  name:           string;
  description?:   string;
  price:          number;
  weight?:        number;
  stock_quantity: number;
  is_active?:     boolean;
}

// ── ตรงกับ prisma.cartItem (cartItem model) ───────────────────
// getCart → prisma.cartItem.findMany({ include: { product: true } })
export interface CartItem {
  cart_item_id: number;      // PK ของ cartItem
  customer_id:  number;
  product_id:   number;
  quantity:     number;
  product:      Product;     // มาจาก include: { product: true }
}

// ── Payload สำหรับ addToCart ──────────────────────────────────
// POST /cart  → cart.controller.js addToCart
export interface AddToCartPayload {
  customer_id: number;
  product_id:  number;
  quantity:    number;
}

// ── Payload สำหรับ updateQty ──────────────────────────────────
// PATCH /cart  → cart.controller.js updateQty
export interface UpdateQtyPayload {
  cart_item_id: number;
  quantity:     number;
}

// ── Response จาก removeCart ───────────────────────────────────
// DELETE /cart/:id  → { message: "deleted" }
export interface DeleteResponse {
  message: string;
}

// ── สรุปยอดคำนวณใน Frontend (ไม่ได้มาจาก API โดยตรง) ────────
export interface CartSummary {
  items:           CartItem[];
  subtotal:        number;
  item_count:      number;
}