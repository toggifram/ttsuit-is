import type { Metadata } from "next";
import Link from "next/link";

import { brand } from "@/lib/site";

export const metadata: Metadata = {
  title: "Skilmálar",
  description: "Skilmálar póstlista og 15% afsláttar hjá Tjé Tjé.",
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16 md:px-8 md:py-24">
      <p className="text-sm text-ink/50">Skilmálar</p>
      <h1 className="mt-2 font-serif text-4xl text-forest md:text-5xl">
        Póstlisti og afsláttur
      </h1>
      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-ink/75">
        <p>
          Með því að skrá þig á póstlista {brand.name} samþykkir þú að við
          sendum þér fréttir, tilboð og uppfærslur um sérsaum og vefverslun.
        </p>
        <p>
          Nýskráning gefur 15% afslátt af gjafabréfum og tilbúnum fatnaði.
          Afslátturinn gildir ekki um sérsaum. Við sendum kóðann á netfangið
          þitt. Ein tilboð per netfang.
        </p>
        <p>
          Þú getur afskráð þig hvenær sem er. Við notum netfangið aðeins í
          þessum tilgangi og deilum því ekki.
        </p>
        <p>
          Spurningar? Skrifaðu á{" "}
          <a
            href={`mailto:${brand.email}`}
            className="text-forest underline-offset-4 hover:underline"
          >
            {brand.email}
          </a>
          .
        </p>
      </div>
      <p className="mt-12 text-sm">
        <Link href="/" className="text-forest underline-offset-4 hover:underline">
          Til baka á forsíðu
        </Link>
      </p>
    </section>
  );
}
