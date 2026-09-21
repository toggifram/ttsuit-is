import type { Metadata } from "next";

import { PickupPrintForm } from "@/components/pickup-print-form";

export const metadata: Metadata = {
  title: "Sækja-miði",
  description: "80 × 50 mm miði á pokann fyrir pantanir sem eru sóttar.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function PickupPrintPage() {
  return <PickupPrintForm />;
}
