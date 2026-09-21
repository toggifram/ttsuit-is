import type { Metadata } from "next";

import { MaintenanceScreen } from "@/components/maintenance-screen";

export const metadata: Metadata = {
  title: "Uppfærsla",
  robots: { index: false, follow: false },
};

export default function MaintenancePreviewPage() {
  return (
    <div className="fixed inset-0 z-[200]">
      <MaintenanceScreen />
    </div>
  );
}
