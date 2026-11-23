import { useMemo } from "react";
import { NotificationCenter } from "@/components/NotificationCenter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SiteHeader from "@/components/SiteHeader";
import { useCampusProgress } from "@/hooks/useCampusProgress";
import { useTaskNotifications } from "@/hooks/useTaskNotifications";
import { CAMPUS_PROGRAMS } from "@/data/campus.generated";
import { campusItems } from "@/lib/progress";
import { realLearningRecord } from "@/lib/portal-data";
import { useTranslation } from "@/lib/i18n";

/**
 * The page reflects actual student checkmarks stored by the campus.
 * It does not launch simulated tasks or claim server-side push delivery.
 */
export default function Notifications() {
  const { lang } = useTranslation();
  const { state } = useCampusProgress();
  const controller = useTaskNotifications();
  const programs = useMemo(() => realLearningRecord(CAMPUS_PROGRAMS, state), [state]);

  const completed = useMemo(() => CAMPUS_PROGRAMS.flatMap(program => {
    return campusItems(program.weeks.length)
      .filter(item => state[program.slug + "/" + item] === true)
      .map(item => ({
        id: program.slug + "/" + item,
        label: program.title + " · " + (
          item.startsWith("semana-")
            ? program.weeks.find(week => "semana-" + String(week.number).padStart(2, "0") === item)?.title || item
            : item
        ),
      }));
  }), [state]);

  const spanish = lang === "es";
  const title = spanish ? "Notificaciones del aprendizaje" : "Learning notifications";
  return (
    <div className="min-h-screen bg-[#071016] text-[#f3f7f3]">
      <SiteHeader />
      <main className="mx-auto max-w-4xl space-y-7 px-5 py-12 lg:py-16">
        <header>
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            {spanish
              ? "Configura las alertas del navegador. Las actividades realmente completadas generan avisos mientras SECURE T esté abierto, incluso si estudias en otra ruta o pestaña de la aplicación."
              : "Configure browser alerts. Actual completions trigger notifications while SECURE T is open, including work on other routes or tabs."}
          </p>
        </header>
        <NotificationCenter controller={controller} />
        <Card>
          <CardHeader>
            <CardTitle>{spanish ? "Actividades registradas" : "Recorded activities"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              {spanish
                ? "Este listado usa el progreso local real; no es un historial de notificaciones enviadas."
                : "This list comes from real local progress, not a log of delivered notifications."}
            </p>
            <p className="mb-4 text-sm">
              {completed.length} {spanish ? "actividades completadas" : "completed activities"} ·
              {" "}{programs.filter(program => program.complete).length} {spanish ? "programas marcados como completos" : "programs marked complete"}
            </p>
            {completed.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {spanish ? "Aún no has marcado actividades como completadas." : "No activities have been marked completed yet."}
              </p>
            ) : (
              <ul className="max-h-[26rem] divide-y divide-white/10 overflow-auto rounded-xl border border-white/10">
                {completed.map(item => (
                  <li key={item.id} className="flex items-start justify-between gap-3 px-4 py-3 text-sm">
                    <span>{item.label}</span>
                    <span className="shrink-0 text-[#b8f36b]">{spanish ? "Completado" : "Completed"}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
