import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { capturePayPalOrder } from "@/lib/api";
import { SiteLayout } from "@/components/site-layout";

export default function PayPalReturnPage() {
  const [params] = useSearchParams();
  const id = params.get("id") || "";
  const token = params.get("token") || "";
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    capturePayPalOrder({ orderId: id, token })
      .then(({ status }) => {
        if (status === "COMPLETED") { navigate(`/order-success?id=${id}`); }
        else { navigate("/checkout?slug="); }
      })
      .catch(() => { navigate("/checkout?slug="); });
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
