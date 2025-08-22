# Supabase setup

This guide creates the schema, buckets, and RLS policies for Kein Shopstream. Run SQL in the Supabase SQL editor or through `supabase db`.

## 1) Buckets
- storage: `product-images` (public read), `avatars` (public read), `seller-assets` (private)

## 2) SQL schema

```sql
-- Enable UUID and extensions as needed
create extension if not exists "uuid-ossp";

-- Profiles bound to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user','seller','admin')),
  name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  parent_id uuid references public.categories(id)
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid not null references public.profiles(id),
  title text not null,
  description text,
  price bigint not null,
  currency text not null default 'INR',
  images jsonb not null default '[]',
  status text not null default 'active' check (status in ('active','hidden','archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text unique,
  color text,
  size text,
  stock integer not null default 0,
  price_override bigint
);

create table if not exists public.wishlist (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  primary key (user_id, product_id)
);

create table if not exists public.carts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active','converted','abandoned')),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default uuid_generate_v4(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id),
  variant_id uuid references public.product_variants(id),
  qty integer not null check (qty > 0),
  price_at_add bigint not null,
  unique (cart_id, product_id, variant_id)
);

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id),
  seller_id uuid not null references public.profiles(id),
  total bigint not null,
  currency text not null default 'INR',
  status text not null default 'created' check (status in ('created','paid','shipped','delivered','canceled','refunded')),
  payment_intent_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  variant_id uuid references public.product_variants(id),
  qty integer not null,
  price bigint not null
);

create table if not exists public.livestreams (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid not null references public.profiles(id),
  title text not null,
  description text,
  scheduled_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  livekit_room text,
  thumbnail_url text,
  is_live boolean not null default false
);

create table if not exists public.live_products (
  id uuid primary key default uuid_generate_v4(),
  livestream_id uuid not null references public.livestreams(id) on delete cascade,
  product_id uuid not null references public.products(id),
  highlighted_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  live_stream_id uuid not null references public.livestreams(id) on delete cascade,
  user_id uuid not null references public.profiles(id),
  message text not null,
  created_at timestamptz not null default now()
);
```

## 3) RLS policies

```sql
alter table public.profiles enable row level security;
create policy "Users can view their own profile and sellers" on public.profiles
  for select using ( true ); -- public profiles
create policy "Users can update own profile" on public.profiles
  for update using ( auth.uid() = id );

alter table public.products enable row level security;
create policy "Products are public" on public.products for select using (true);
create policy "Seller can manage own products" on public.products
  for insert with check (seller_id = auth.uid())
  using (seller_id = auth.uid());

alter table public.product_variants enable row level security;
create policy "Variants readable" on public.product_variants for select using (true);
create policy "Seller manages variants" on public.product_variants
  for all using (exists(select 1 from public.products p where p.id = product_id and p.seller_id = auth.uid()))
  with check (exists(select 1 from public.products p where p.id = product_id and p.seller_id = auth.uid()));

alter table public.wishlist enable row level security;
create policy "Read own wishlist" on public.wishlist for select using (user_id = auth.uid());
create policy "Modify own wishlist" on public.wishlist for all using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table public.carts enable row level security;
create policy "Read own cart" on public.carts for select using (user_id = auth.uid());
create policy "Manage own cart" on public.carts for all using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table public.cart_items enable row level security;
create policy "Read items via own cart" on public.cart_items for select using (
  exists(select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
);
create policy "Manage items via own cart" on public.cart_items for all using (
  exists(select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
) with check (
  exists(select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
);

alter table public.orders enable row level security;
create policy "Read own orders" on public.orders for select using (user_id = auth.uid() or seller_id = auth.uid());
create policy "Insert order server-side only" on public.orders for insert with check (false);

alter table public.order_items enable row level security;
create policy "Read own order items" on public.order_items for select using (
 exists(select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or o.seller_id = auth.uid()))
);

alter table public.livestreams enable row level security;
create policy "Read livestreams" on public.livestreams for select using (true);
create policy "Seller manages own streams" on public.livestreams for all using (seller_id = auth.uid()) with check (seller_id = auth.uid());

alter table public.live_products enable row level security;
create policy "Read live products" on public.live_products for select using (true);
create policy "Seller manages live products" on public.live_products for all using (
  exists(select 1 from public.livestreams l where l.id = livestream_id and l.seller_id = auth.uid())
) with check (
  exists(select 1 from public.livestreams l where l.id = livestream_id and l.seller_id = auth.uid())
);

alter table public.chat_messages enable row level security;
create policy "Read chat" on public.chat_messages for select using (true);
create policy "Send chat when authenticated" on public.chat_messages for insert with check (user_id = auth.uid());
```

## 4) Edge Functions (optional)
- `checkout-session`: create Stripe PaymentIntent and return client secret
- `post-payment`: handle Stripe webhook if not using Node service
- `seller-guard`: validate role before privileged actions

## 5) Environment variables
- Frontend: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Node service: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_URL`
