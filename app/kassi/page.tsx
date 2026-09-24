import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout-form";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Kassi",
  description: "Sending og greiðsla — vefverslun Tjé Tjé.",
  path: "/kassi",
  robots: { index: false, follow: false },
});

export default function KassiPage() {
  return <CheckoutForm />;
}
