import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site-layout";
import { capturePayPalOrder } from "@/lib/paypal.functions";

export const Route = createFileRoute("/paypal-return")({
  validateSearch: (s) =>
    z
      .object({
        id: z.string().min(1),
        token: z.string().optional(),
        PayerID: z.string().optional(),
      })
      .parse(s),
  head: () => ({ meta: [{ title: "Completing payment — Rewindd" }] }),
  component: PayPalReturn,
});

function PayPalReturn() {
  const { id, token } = Route.useSearch();
  const capture = useServerFn(capturePayPalOrder);
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMsg("Missing PayPal token.");
      return;
    }
    capture({ data: { orderId: id, token } })
      .then(() => {
        setStatus("ok");
        navigate({ to: "/order-success", search: { id } });
      })
      .catch((e: any) => {
        setStatus("error");
        setMsg(e?.message || "Capture failed");
      });
  }, [id, token, capture, navigate]);

  return (
    <SiteLayout>
      <section className="min-h-[60vh] bg-cream flex items-center justify-center px-6 pt-32 pb-24">
        <div className="max-w-md text-center">
          {status === "loading" && (
            <p className="text-warm-gray">Confirming your PayPal payment…</p>
          )}
          {status === "error" && (
            <>
              <h1 className="section-title">Payment <em>could not be completed.</em></h1>
              <p className="mt-4 text-warm-gray">{msg}</p>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
