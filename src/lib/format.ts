const localeFor: Record<string, string> = {
  gbp: "en-GB",
  eur: "en-IE",
  usd: "en-US",
};

export function formatCents(cents: number, currency = "gbp") {
  const cur = currency.toLowerCase();
  return new Intl.NumberFormat(localeFor[cur] ?? "en-GB", {
    style: "currency",
    currency: cur.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(cents / 100);
}
