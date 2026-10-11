import { StandardsView } from "@/components/standards-view";
import { readPackages } from "@/lib/content";

export default function EstandaresPt() {
  return <StandardsView locale="pt" index={readPackages()} />;
}
