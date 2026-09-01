import type { Metadata } from "next";

import { ScrollToHash } from "@/components/scroll-to-hash";
import {
  SersaumurBoka,
  SersaumurEfnin,
  SersaumurFerlid,
  SersaumurHero,
  SersaumurSpurningar,
  SersaumurSubnav,
  SersaumurVerdskra,
} from "@/components/sersaumur-sections";

export const metadata: Metadata = {
  title: "Sérsaumur",
  description:
    "Sérsaumuð jakkaföt, jakkar og skyrtur eftir þínum mælingum. Ferlið, efnin, verðskrá og bókun — 4–6 vikur.",
};

export default function SersaumurPage() {
  return (
    <>
      <ScrollToHash />
      <SersaumurHero />
      <SersaumurSubnav />
      <SersaumurFerlid />
      <SersaumurEfnin />
      <SersaumurVerdskra />
      <SersaumurBoka />
      <SersaumurSpurningar />
    </>
  );
}
