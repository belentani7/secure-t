import { ThreatsView } from "@/components/threats-view";
import { readThreatIntel } from "@/lib/content";

export default function AmenazasPt() {
  return (
    <div className="wrap section">
      <ThreatsView locale="pt" intel={readThreatIntel()} />
    </div>
  );
}
