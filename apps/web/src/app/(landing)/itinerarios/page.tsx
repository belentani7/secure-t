import type { Metadata } from "next";
import { translator } from "@secure-t/shared";
import { TracksView } from "@/components/tracks-view";

/** La portada en portugués de Brasil (idioma por defecto) también tiene rutas. */
export const metadata: Metadata = {
  title: translator("pt")("tracks.title"),
  description: translator("pt")("tracks.lead")
};

export default function ItinerariosPage() {
  return <TracksView locale="pt" />;
}
