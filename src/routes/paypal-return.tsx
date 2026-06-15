import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SiteLayout } from "@/components/site-layout";
import { capturePayPalOrder } from "@/lib/paypal.functions";

export const Route = createFileRoute("/paypal-return")({
  validateSearch: (s) =>
    z
      .object({
        id: z.string().uuid(), // our internal order id
        token: z.string().min(1), // PayPal order token
        PayerID: z.string().optional(), // PayPal payer id
      })
      .parse(s),
  head: () => ({ meta: [{ title: "Completing your order… — Rewindd" }] }),
  component: PayPalReturn,
});

function PayPalReturn() {
  const { id, token } = Route.useSearch();
  const navigate = useNavigate();
  const capture = useServerFn(capturePayPalOrder);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    capture({ data: { orderId: id, token } })
      .then(({ status }) => {
        if (status === "COMPLETED") {
          navigate({ to: "/order-success", search: { id } });
        } else {
          // Payment not completed — send back to checkout
          navigate({ to: "/checkout", search: { slug: "" } });
        }
      })
      .catch(() => {
        navigate({ to: "/checkout", search: { slug: "" } });
      });
  }, []);

  return (
    <SiteLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-warm-gray">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Completing your order…</p>
      </div>
    </SiteLayout>
  );
}
