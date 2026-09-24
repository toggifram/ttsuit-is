import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata } from "@/lib/seo";
import { brand } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Skilmálar",
  description: `Skilmálar ${brand.name}.`,
  path: "/skilmalar",
});

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
      <p className="text-sm text-ink/50">Skilmálar</p>
      <h1 className="mt-2 font-serif text-4xl text-forest md:text-5xl">
        Skilmálar
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-ink/70">
        Allar verslanir hafa skilmála. Hér eru okkar.
      </p>

      <div className="mt-12 space-y-10 text-[15px] leading-relaxed text-ink/75">
        <section>
          <h2 className="font-serif text-2xl text-forest">
            Upplýsingar um fyrirtækið/söluaðilann
          </h2>
          <p className="mt-3">
            TT/TjéTjé —{" "}
            <a
              href={`mailto:${brand.email}`}
              className="text-forest underline-offset-4 hover:underline"
            >
              {brand.email}
            </a>
            , áskilur sér rétt til að hætta við pantanir, t.d. vegna rangra
            verðupplýsinga, eða hætta að bjóða upp á ákveðna vöru
            fyrirvaralaust.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-forest">
            Greiðsluupplýsingar og sendingarmáti
          </h2>
          <p className="mt-3">
            Viðskiptavinir greiða með greiðslukorti, Apple Pay eða Google Pay
            í gegnum Teya. Greiðslan fer fram á öruggum Shopify-kassa frá{" "}
            {brand.domain}. Öll verð á vefsíðunni eru gefin upp með
            virðisaukaskatti. Sendingarkostnaður bætist við — nákvæmar
            sendingarleiðir og verð birtast í kassanum þegar heimilisfang er
            sett inn.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-forest">
            Afhending vöru og sendingarmáti
          </h2>
          <p className="mt-3">
            Afgreiðslufrestur pantana sem berast í gegnum vefsíðuna er 1–3
            virkir dagar eftir að pöntun og greiðsla berst. Biðin getur lengst
            ef pöntun berst um helgi, á föstudegi eða rauðum dögum.
          </p>
          <p className="mt-3">
            Komi fyrir að vara sé uppseld munum við hafa samband við
            viðskiptavin og kynna valkosti: hvenær varan kemur aftur, eða
            endurgreiða uppselda vöru að fullu sé þess óskað.
          </p>
          <p className="mt-3">
            Allar pantanir eru sendar samkvæmt þeim leiðum sem valdar eru í
            kassanum. Öll vöruverð á vefsíðunni eru án sendingarkostnaðar.
            Hægt er að komast að samkomulagi um aðrar sendingarleiðir með því
            að senda tölvupóst á {brand.email}. Afhendingar-, ábyrgðar- og
            flutningsskilmálar sendingaraðila gilda við afhendingu. Seljandi,
            ber ekki ábyrgð á týndum sendingum eða tjóni sem hlýst á vörum
            kaupanda í flutningi. Ef varan týnist í pósti eða verður fyrir
            tjóni er það á ábyrgð kaupanda. Kaupandi ber ábyrgð á að réttar
            persónuupplýsingar komi fram.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-forest">
            Skilmálar fyrir sérsaum
          </h2>
          <p className="mt-3">
            Sækja þarf sérsaumuð föt eigi seinna en 4 mánuðum eftir mælingu,
            eða gegn samkomulagi. Kaupandi ber sjálfur ábyrgð á saumbreytingum
            á sérsaumuðum fatnaði komi hann í mátun 3 mánuðum eftir að mál
            voru tekin. Frá mælingu eru það venjulega 4–6 vikur þar til hægt
            er að klæðast sérsaumnum.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-forest">Skila og skipta</h2>
          <p className="mt-3">
            Veittur er 14 daga skilaréttur við kaup á vöru gegn framvísun
            sölureiknings sem sýnir með fullnægjandi hætti hvenær varan var
            keypt. Þetta gildir þó ekki um vörur sem keyptar eru á útsölu.
            Varan þarf að vera ónotuð, með öllum merkjum og í upphaflegum
            umbúðum. Ekki má rjúfa innsiglið ef varan er innsigluð.
          </p>
          <p className="mt-3">
            Við skil á vöru er miðað við verð samkvæmt greiðslukvittun og er
            varan endurgreidd að fullu. Sendingarkostnaður er ekki
            endurgreiddur. Ef meira en 14 dagar eru frá vörukaupum getur
            kaupandi skipt vörunni fyrir aðra vöru eða fengið inneignarnótu
            eftir að varan hefur verið móttekin. Inneignarnótan er í formi
            kóða sem hægt er að nota í vefverslun.
          </p>
          <p className="mt-3">
            Sé vara gölluð er viðskiptavini boðin ný vara ásamt sendingu,
            honum að kostnaðarlausu. Að öðru leyti vísast til laga um
            húsgöngu- og fjarsölu nr. 46/2000 og laga um neytendakaup.
            Vinsamlegast sendið tölvupóst á {brand.email} áður en vöru er
            skilað.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-forest">
            Persónuupplýsingar viðskiptavina
          </h2>
          <p className="mt-3">
            Kaupandi fyllir út upplýsingar um nafn, tölvupóst og heimilisfang.
            Við pöntun samþykkir kaupandi að þessar upplýsingar fari í
            viðskiptavinagagnagrunn {brand.name}. Þessar upplýsingar eru
            trúnaðarmál og verða ekki afhentar þriðja aðila. Lögð er áhersla
            á öryggi persónuupplýsinga og farið er með slíkar upplýsingar í
            samræmi við lög og reglur um persónuvernd. {brand.name} safnar
            eingöngu upplýsingum til að veita þá þjónustu sem beðið er um. Með
            samþykki þínu notum við Google Analytics og Meta Pixel til
            tölfræði og markaðssetningar, eins og lýst er í{" "}
            <Link
              href="/vafrakokur"
              className="text-forest underline-offset-4 hover:underline"
            >
              stefnu um vafrakökur
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-forest">
            Póstlisti og afsláttur
          </h2>
          <p className="mt-3">
            Með því að skrá þig á póstlista {brand.name} samþykkir þú að við
            sendum þér fréttir, tilboð og uppfærslur. Nýskráning gefur 10%
            afsláttarkóða (Open10) af tilbúnum fatnaði í vefverslun.
            Afslátturinn gildir ekki á gjafabréf eða sérsaum. Aðeins einn
            afsláttarkóði gildir á hver kaup. Kóðinn birtist
            um leið og þú skráir þig. Ein tilboð per netfang. Þú getur
            afskráð þig hvenær sem er.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-forest">
            Lög, varnarþing og fyrirvarar
          </h2>
          <p className="mt-3">
            Öll ákvæði þessara skilmála ber að túlka í samræmi við íslensk
            lög. Komi upp ágreiningur milli aðila verður slíkur ágreiningur
            einungis leystur fyrir íslenskum dómstólum. Rísi mál vegna hans
            skal það rekið fyrir Héraðsdómi Reykjaness.
          </p>
        </section>
      </div>

      <p className="mt-12 text-sm">
        <Link href="/" className="text-forest underline-offset-4 hover:underline">
          Til baka á forsíðu
        </Link>
      </p>
    </section>
  );
}
