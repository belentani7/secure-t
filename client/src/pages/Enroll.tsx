import { OnboardingFlow } from "@/components/OnboardingFlow";
import { useLanguage } from "@/hooks/useLanguage";
import { Link, useLocation } from "wouter";

const notice = {
  "pt-BR": "Matrícula local e anônima: geramos um token UUID no seu navegador, sem e-mail nem nome. O progresso fica neste dispositivo (demonstração, sem backend).",
  es: "Matrícula local y anónima: generamos un token UUID en tu navegador, sin e-mail ni nombre. El progreso queda en este dispositivo (demo, sin backend).",
  en: "Local anonymous enrollment: we generate a UUID token in your browser, no email or name. Progress stays on this device (demo, no backend).",
} as const;

const back = {
  "pt-BR": "Voltar ao campus",
  es: "Volver al campus",
  en: "Back to campus",
} as const;

export default function Enroll() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();

  return (
    <div>
      <div className="border-b border-white/10 bg-[#071016] px-5 py-3 text-center text-xs text-white/55">
        {notice[language]}{" "}
        <Link href="/" className="ml-2 font-bold text-[#b8f36b] hover:underline">
          {back[language]}
        </Link>
      </div>
      <OnboardingFlow onComplete={() => navigate("/courses")} />
    </div>
  );
}
