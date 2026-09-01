import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Kassi",
  description: "Sending og greiðsla — vefverslun Tjé Tjé.",
};

export default function KassiPage() {
  return <CheckoutForm />;
}
