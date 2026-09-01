import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  sersaumurSectionMap,
  SersaumurSubnav,
} from "@/components/sersaumur-sections";
import { sersaumurSection, sersaumurSections } from "@/lib/site";

type Props = { params: Promise<{ kafli: string }> };

export function generateStaticParams() {
  return sersaumurSections.map((item) => ({ kafli: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kafli } = await params;
  const section = sersaumurSection(kafli);
  if (!section) return { title: "Sérsaumur" };
  return {
    title: `${section.label} · Sérsaumur`,
    description: section.description,
  };
}

export default async function SersaumurKafliPage({ params }: Props) {
  const { kafli } = await params;
  const section = sersaumurSection(kafli);
  const Body = sersaumurSectionMap[kafli as keyof typeof sersaumurSectionMap];
  if (!section || !Body) notFound();

  return (
    <>
      <SersaumurSubnav active={section.slug} />
      <Body />
    </>
  );
}
