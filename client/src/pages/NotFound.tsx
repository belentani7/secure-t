import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";
import { useTranslation } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-[#071016] text-[#f3f7f3] flex items-center justify-center px-4">
      <Card className="w-full max-w-lg border border-white/10 bg-[#101d24] shadow-[0_25px_80px_rgba(0,0,0,.35)]">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#b8f36b]/10 rounded-full animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-[#b8f36b]" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">404</h1>

          <h2 className="text-xl font-semibold text-white/70 mb-4">
            {t("notfound.title")}
          </h2>

          <p className="text-white/50 mb-8 leading-relaxed">
            {t("notfound.subtitle")}<br />
            {t("notfound.detail")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoHome}
              className="rounded-xl bg-[#b8f36b] px-6 py-3 text-sm font-bold text-[#071016] transition hover:bg-[#d0ff9a]"
            >
              <Home className="w-4 h-4 mr-2" />
              {t("notfound.go_home")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
