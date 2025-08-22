# Kein Shopstream – Backend Architecture and Delivery Plan

This plan adopts Node.js + Supabase (Auth, Postgres, Storage, Realtime) and WebRTC for live video to turn the current mock-driven frontend into a production-ready live shopping platform.

---

## Goals

- Replace mocked data with secure, documented APIs.
- Support livestream commerce: viewer chat, product spotlight, add-to-cart, checkout.
- Enable seller operations: catalog, inventory, orders, payouts.
- Ship incrementally with minimal downtime and good observability.

## High-level architecture

- Platform: Supabase (Postgres, Auth, Storage, Realtime)
- Backend runtime: Node.js (TypeScript)
  - Edge Functions (Supabase) for lightweight serverless endpoints (optional)
  - A small Node service for: Stripe webhooks, WebRTC token/signaling if not using a managed provider
- DB: Supabase Postgres (managed)
- Auth: Supabase Auth (email/password + OTP + OAuth providers as needed)
- Storage: Supabase Storage buckets for product and avatar images
- Realtime: Supabase Realtime channels (chat, presence) and/or WebRTC DataChannels
- Live video: WebRTC via LiveKit (recommended) — Cloud or self-hosted; Node issues participant tokens
- Payments: Stripe (Cards, UPI via Stripe India if applicable) — webhook -> order lifecycle
- Search: Postgres full-text initially; upgrade later if needed
- Email/SMS: Supabase Auth emails; Resend/SendGrid + Twilio as needed
- Infra: GitHub Actions CI; deploy Edge Functions via Supabase; Node service deploy to Fly.io/Render/Railway

## Data model (ERD outline)

- Auth users live in `auth.users` (Supabase). Create a public profile table:
- Profile(id uuid pk references auth.users, role[user,seller,admin], name, avatar_url, created_at)
- Address(id, userId, line1, line2, city, state, postalCode, country, phone)
- Seller(id, userId FK, displayName, bio, socials, kycStatus)
- Category(id, name, slug, parentId)
- Product(id, seller_id, title, description, price, currency, images jsonb, status, created_at)
- ProductVariant(id, productId, sku, color, size, stock, priceOverride?)
- Wishlist(id, userId, productId)
- Cart(id, user_id, status[active,converted,abandoned], updated_at)
- CartItem(id, cart_id, product_id, variant_id, qty, price_at_add)
- Order(id, user_id, seller_id, total, currency, status[created,paid,shipped,delivered,canceled,refunded], payment_intent_id, created_at)
- OrderItem(id, order_id, product_id, variant_id, qty, price)
- LiveStream(id, seller_id, title, description, scheduled_at, started_at, ended_at, livekit_room, thumbnail_url, is_live)
- LiveProduct(id, liveStreamId, productId, highlightedAt)
- ChatMessage(id, live_stream_id, user_id, message, created_at)
- InventoryEvent(id, productId, variantId, delta, reason, createdAt)
- Coupon(id, code, discountType[amount,percent], value, startsAt, endsAt, usageLimit, usedCount)

Notes:
- Price stored in minor units (e.g., paise/cents). Keep currency at order level.
- Variant-first cart model to avoid ambiguity.
- Inventory events append-only; derive current stock.

## API design (Supabase + Node + WebRTC)

Base URL (if using Node service): /api/v1

- Auth
  - Supabase Auth handles signup/login/refresh
  - Frontend uses supabase-js with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

- Users
  - GET /me
  - PATCH /me
  - GET /me/addresses; POST /me/addresses; DELETE /me/addresses/:id

- Catalog (read via PostgREST or supabase-js)
  - GET /categories
  - GET /products?search=&category=&seller=&cursor=&limit=
  - GET /products/:id
  - GET /products/:id/variants

- Wishlist (RLS; per-user ops)
  - GET /me/wishlist
  - POST /me/wishlist/:productId
  - DELETE /me/wishlist/:productId

- Cart (server-side; persists across devices)
  - GET /me/cart
  - POST /me/cart/items { productId, variantId, qty }
  - PATCH /me/cart/items/:itemId { qty }
  - DELETE /me/cart/items/:itemId
  - POST /me/cart/apply-coupon { code }

- Checkout/Orders
  - POST /checkout/session -> returns clientSecret/paymentIntent info
  - POST /webhooks/stripe (no auth; verify signature) — Node service or Supabase Edge Function
  - GET /me/orders
  - GET /me/orders/:id

- Livestreams
  - GET /livestreams?status=live|upcoming|ended
  - GET /livestreams/:id
  - GET /livestreams/:id/products
  - POST /seller/livestreams (seller)
  - POST /seller/livestreams/:id/start|end (seller)
  - POST /seller/livestreams/:id/highlight { productId }

- Seller (protected by role=seller via RLS + RPC/Edge Functions)
  - GET /seller/products; POST /seller/products; PATCH /seller/products/:id
  - PATCH /seller/products/:id/variants/:variantId
  - GET /seller/orders
  - GET /seller/analytics (basic metrics)

### Realtime and WebRTC

- Realtime chat/presence: Supabase Realtime channels `realtime:livestream:{id}`
  - Events: chat:new, product:highlighted, viewer:count
- WebRTC A/V: LiveKit rooms per livestream (`LiveStream.livekit_room`)
  - Frontend uses livekit-client to join room
  - Node endpoint mints ephemeral participant tokens after validating Supabase session
  - Optionally use DataChannels for in-room chat; otherwise use Supabase Realtime
  - If fully self-hosted is not desired, use LiveKit Cloud

Note: You can also use Supabase Realtime as a signaling bus, but a managed SFU like LiveKit is recommended for 1-to-many scale and network adaptation.

## Contracts (selected)

- Product
```json
{
  "id": "p_123",
  "title": "Women solid top",
  "price": 99900,
  "currency": "INR",
  "images": ["https://.../img1.jpg"],
  "variants": [
    {"id":"v_1","sku":"SKU-RED-M","color":"Red","size":"M","stock":12,"price":99900}
  ]
}
```

- Cart
```json
{
  "id": "c_123",
  "items": [
    {"id":"ci_1","productId":"p_123","variantId":"v_1","qty":2,"priceAtAdd":99900}
  ],
  "subtotal": 199800,
  "discount": 0,
  "total": 199800,
  "currency": "INR"
}
```

- Chat WebSocket event
```json
{ "type": "chat:new", "payload": {"id":"m1","user":{"id":"u1","name":"Amy"},"message":"Nice!","ts":1734900000}}
```

## Security & privacy

- Supabase Auth manages sessions; validate on the server before privileged ops.
- RLS policies on all tables in public schema; expose only necessary selects.
- Rate limit chat/checkout endpoints (Edge Functions/Node) and validate payload with Zod.
- Encrypt PII in transit (TLS); minimize stored PII. Never store card data.
- Webhook signature verification (Stripe), idempotency keys for order creation.

## Observability

- Node service: pino logs with request IDs; metrics via Prometheus or vendor
- Supabase: monitor DB/Edge logs and function invocations
- Track: RPS, p95 latency, error rates, WS connections, viewer count, checkout conversion

## Deployment

- Edge Functions deployed via `supabase functions deploy`
- Node service (webhooks + token endpoint) as Docker to Fly.io/Render/Railway
- GitHub Actions CI: lint/typecheck/tests, deploy functions, deploy Node service

## Migration strategy

- Use Supabase SQL migrations (via `supabase db` or SQL files in this repo)
- Seed dev with sample data and a demo livestream
- Keep idempotent seed scripts

## Phased delivery

Phase 0 – Foundations (1 week)
- Create Supabase project, enable Auth (email/password + OTP), create buckets
- Apply SQL schema and RLS policies (see supabase-setup.md)
- Scaffold Node service (TypeScript, ESLint, Prettier) with endpoints: `/livekit/token`, `/webhooks/stripe`
- Frontend: add supabase-js client and env wiring

Phase 1 – Cart & Checkout (1–2 weeks)
- Server-side cart with RLS (CRUD on cart/cart_items bound to user)
- Stripe payment intents; webhook creates orders and decrements inventory
- Optional Supabase Edge Function for `/checkout/session`
- Frontend: cart and product detail use supabase-js; optimistic qty updates

Phase 2 – Livestream & Realtime (1–2 weeks)
- LiveKit: create room per LiveStream; Node endpoint mints tokens
- Supabase Realtime: chat and product highlight messages in `livestream:{id}` channels
- Frontend: replace mock chat/products with Realtime + LiveKit playback

Phase 3 – Seller Ops (1 week)
- Seller product CRUD, variant stock adjustments, live scheduling/start/stop
- Basic analytics (orders, revenue, viewers)

Phase 4 – Polish & Scale (ongoing)
- Coupons, wishlist, search, address + shipping rates, email/SMS notifications
- Caching hot endpoints with Redis; add background workers for webhooks and chat persistence
- Hardening: unit/integration tests, load test hotspots, add SLOs

## Minimal services layout

Node service (webhooks + LiveKit token):
```
services/node
  src/
    index.ts (Fastify/Express)
    routes/
      stripe-webhook.ts
      livekit-token.ts
    lib/
      stripe.ts
      supabase.ts (service role key)
      livekit.ts
  package.json
  Dockerfile
```

## Frontend integration notes

- Add `lib/supabaseClient.ts` and configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Read catalog via supabase-js; cart/checkout via RLS + Edge Functions
- Live: use livekit-client; request token from Node endpoint; use Supabase Realtime for chat
- Keep `CartContext` to mirror server cart; reconcile on auth changes

## Risks & mitigations

- Live scale: use LiveKit Cloud or scale SFU; test at target viewer counts
- Payment failures: strong webhook handling and idempotency
- Inventory races: decrement on payment success; use constraints and check stock on add-to-cart
- Chat abuse: RLS, rate limits, profanity filters, moderation tools

## Next steps

1) Create Supabase project; run SQL from supabase-setup.md and configure RLS
2) Stand up Node service for Stripe webhook and LiveKit tokens
3) Add supabase-js to the frontend; wire products/cart; replace mocks incrementally
