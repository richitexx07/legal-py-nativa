import { getLegalPolicies } from "@/lib/legal";
import LegalCenterClient from "./LegalCenterClient";

export const metadata = {
  title: "Centro Legal y de Transparencia - Legal PY",
  description: "Políticas y términos de uso de Legal PY",
};

export default function LegalCenterPage() {
  const policyLevels = getLegalPolicies();

  return <LegalCenterClient policyLevels={policyLevels} />;
}
