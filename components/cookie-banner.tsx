"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";

import {
  CONSENT_KEYS,
  type CookieChoice,
  readConsent,
  writeConsent,
} from "@/lib/consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [stats, setStats] = useState(true);

  useEffect(() => {
    if (!readConsent(CONSENT_KEYS.cookies)) setVisible(true);
  }, []);

  function save(choice: CookieChoice) {
    writeConsent(CONSENT_KEYS.cookies, choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] bg-forest text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-5 md:flex-row md:items-end md:justify-between md:gap-10 md:px-8 md:py-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold">Vefsíðan notar vafrakökur</p>
          <p className="mt-2 text-[13px] leading-relaxed text-white/80">
            Við notum vafrakökur til að bæta upplifunina. Með því að nota
            síðuna samþykkir þú vafrakökur í samræmi við{" "}
            <Link
              href="/vafrakokur"
              className="underline underline-offset-2 hover:text-white"
            >
              stefnu okkar
            </Link>
            .
          </p>
          <button
            type="button"
            onClick={() => setSettingsOpen((open) => !open)}
            className="mt-3 inline-flex items-center gap-2 text-[11px] tracking-[0.16em] text-white/80 uppercase hover:text-white"
          >
            <Settings className="size-3.5" />
            Stillingar
          </button>
          {settingsOpen ? (
            <div className="mt-4 space-y-3 border border-white/15 px-4 py-4 text-[13px]">
              <label className="flex items-start gap-3 text-white/80">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-0.5 size-3.5 accent-white"
                />
                <span>
                  <span className="font-medium text-white">Nauðsynlegar</span>
                  {" — "}karfa, valmynd og val þitt um vafrakökur.
                </span>
              </label>
              <label className="flex items-start gap-3 text-white/80">
                <input
                  type="checkbox"
                  checked={stats}
                  onChange={(e) => setStats(e.target.checked)}
                  className="mt-0.5 size-3.5 accent-white"
                />
                <span>
                  <span className="font-medium text-white">Tölfræði</span>
                  {" — "}hjálpar okkur að sjá hvað virkar á síðunni.
                </span>
              </label>
              <button
                type="button"
                onClick={() => save(stats ? "all" : "necessary")}
                className="text-[11px] tracking-[0.16em] text-white uppercase underline underline-offset-4"
              >
                Vista stillingar
              </button>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => save("all")}
          className="h-12 shrink-0 bg-white px-10 text-[12px] font-semibold tracking-[0.18em] text-forest uppercase transition-colors hover:bg-cream"
        >
          Samþykkja
        </button>
      </div>
    </div>
  );
}
