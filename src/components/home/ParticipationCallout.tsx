import { CTASection } from "@/components/ui/CTASection";
import { Button } from "@/components/ui/Button";

export function ParticipationCallout() {
  return (
    <CTASection
      title="Tu idea también puede cambiar la ciudad."
      description="Contanos qué problema ves en tu barrio o qué propuesta tenés para Alta Gracia."
    >
      <Button href="/participa" variant="secondary" size="lg" className="bg-white">
        Proponer una idea
      </Button>
    </CTASection>
  );
}
