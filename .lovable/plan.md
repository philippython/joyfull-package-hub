# Rewindd — Premium Date Night Ritual Kit

## Overview
Rebuild the Rewindd website into a beautiful, full-featured e-commerce experience with Stripe checkout, a customer ordering flow, and an admin dashboard for managing products. The design language is: burgundy + gold, editorial serif typography (Cormorant Garamond), warm cream backgrounds, luxury understated feel.

## What we'll build

### 1. Design System & Site Rebuild
- Custom oklch color tokens in `src/styles.css`: burgundy, gold, cream, ivory, charcoal
- Fonts: Cormorant Garamond (headings) + Jost (body) via Google Fonts
- All sections from the uploaded HTML, ported to React/TanStack routes with generated imagery
- Generated images: hero scene, inside-the-kit items, gallery lifestyle shots, about page couple shots
- Rewritten copy to feel natural, connected, and emotionally resonant

### 2. Routes (SEO + shareable pages)
- `/` — Home (hero, story, what's inside, testimonials, how it works, gallery, about preview, FAQ, final CTA)
- `/kit` — Product detail page with full description, add to cart
- `/our-story` — About / brand story
- `/checkout` — Cart + Stripe checkout flow
- `/order-success` — Post-purchase confirmation
- `/admin` — Protected admin dashboard (manage products, view orders)
- `/login` — Auth page

### 3. Database Schema
**products** — Ritual kits/packages the admin can add/edit
- `id`, `name`, `slug`, `description`, `price_cents`, `image_url`, `items_included` (JSON), `is_active`, `created_at`

**orders** — Customer purchases
- `id`, `user_id`, `product_id`, `stripe_session_id`, `status` (pending/paid/cancelled), `shipping_address` (JSON), `amount_cents`, `created_at`

**profiles** — Extended user info
- `id`, `user_id`, `full_name`, `phone`, `is_admin`, `created_at`

**user_roles** — Role-based access control
- `id`, `user_id`, `role` (enum: admin, user)

All tables with RLS policies and proper GRANTs.

### 4. Payments (Stripe built-in)
- Enable Stripe seamless payments (test mode)
- Create products: "Rewindd Date Night Ritual Kit"
- Checkout session server function with shipping address collection
- Webhook handler for `checkout.session.completed` to record orders
- Order confirmation page

### 5. Admin Dashboard (`/admin`)
- Protected by admin role check
- List all orders with status
- Add/edit products (name, price, description, image, items included)
- Toggle product active/inactive
- View order details (customer, shipping, amount)

### 6. Auth
- Email/password sign up / login
- Google OAuth
- Admin role assignment via email allowlist

### 7. Images to generate (8 total)
- Hero: romantic candlelit dinner scene, warm golden light, intimate couple
- Inside kit: flat lay of the ritual items on cream linen
- Gallery (4): couples cooking together, cozy living room, warm embrace, wine glasses
- About: couple laughing in kitchen, warm portrait

## Technical details
- TanStack Start with file-based routing
- Server functions for checkout, orders, admin CRUD
- Supabase for database + auth
- Stripe for payments
- Google Fonts loaded in `__root.tsx`