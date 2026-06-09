import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((raw) =>
    z
      .object({
        productId: z.string().uuid(),
        priceCents: z.number().int().min(0),
        currency: z.string().length(3),
        quantity: z.number().int().min(1).max(10).optional().default(1),
      })
      .parse(raw),
  )
  .handler(async ({ data }) => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("Missing STRIPE_SECRET_KEY in environment");
    // Lazy import to avoid hard dependency during dev if stripe isn't installed yet
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(key, { apiVersion: "2022-11-15" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: data.currency,
            product_data: { name: `Rewindd kit (${data.productId})` },
            unit_amount: data.priceCents,
          },
          quantity: data.quantity ?? 1,
        },
      ],
      success_url: `${process.env.PUBLIC_URL ?? ""}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.PUBLIC_URL ?? ""}/kit`,
      metadata: { productId: data.productId },
    });

    return { url: session.url };
  });
