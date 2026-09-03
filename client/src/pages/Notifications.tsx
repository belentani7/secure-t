import { useCallback, useState } from "react";
import { toast } from "sonner";

import { NotificationCenter } from "@/components/NotificationCenter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskNotifications } from "@/hooks/useTaskNotifications";
import { useTaskWatcher } from "@/hooks/useTaskWatcher";
import { describeTask, type TaskEvent, type TaskKind } from "@notifications";

const SAMPLES: { kind: TaskKind; label: string; failRate: number }[] = [
  {
    kind: "lab",
    label: "Triage de alerta PowerShell sospechosa",
    failRate: 0.15,
  },
  {
    kind: "assessment",
    label: "Corrección del capstone de SOC",
    failRate: 0.1,
  },
  { kind: "ai", label: "Síntesis de fuentes aprobadas", failRate: 0.05 },
];

let counter = 0;

/** Demo surface: launch simulated tasks and see the completion notification. */
export default function Notifications() {
  const controller = useTaskNotifications();
  const [tasks, setTasks] = useState<TaskEvent[]>([]);

  const onNotify = useCallback(
    (event: TaskEvent) => {
      controller.notify(event);
      const c = describeTask(event);
      (event.state === "completed" ? toast.success : toast.error)(c.title, {
        description: c.body,
      });
    },
    [controller]
  );

  useTaskWatcher(tasks, onNotify);

  const patch = (id: string, next: Partial<TaskEvent>) =>
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, ...next, at: new Date().toISOString() } : t
      )
    );

  const launch = (sample: (typeof SAMPLES)[number]) => {
    const id = `sim-${++counter}`;
    const base: TaskEvent = {
      id,
      kind: sample.kind,
      label: sample.label,
      state: "queued",
      at: new Date().toISOString(),
    };
    setTasks(prev => [base, ...prev].slice(0, 8));
    window.setTimeout(() => patch(id, { state: "running" }), 600);
    window.setTimeout(
      () => {
        const failed = Math.random() < sample.failRate;
        patch(id, {
          state: failed ? "failed" : "completed",
          detail: failed
            ? "Revisa los registros del entorno"
            : "Evidencia registrada en auditoría",
        });
      },
      2600 + Math.random() * 1500
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Centro de notificaciones</h1>
        <p className="text-muted-foreground">
          secure T avisa cuando una tarea larga termina, sin bloquear la
          interfaz.
        </p>
      </header>

      <NotificationCenter controller={controller} />

      <Card>
        <CardHeader>
          <CardTitle>Simular tareas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {SAMPLES.map(s => (
              <Button
                key={s.label}
                variant="secondary"
                onClick={() => launch(s)}
              >
                Lanzar: {s.label}
              </Button>
            ))}
          </div>

          <ul className="divide-border divide-y rounded-md border">
            {tasks.length === 0 && (
              <li className="text-muted-foreground p-3 text-sm">
                Sin tareas todavía.
              </li>
            )}
            {tasks.map(t => (
              <li
                key={t.id}
                className="flex items-center justify-between p-3 text-sm"
              >
                <span>{t.label}</span>
                <span
                  data-state={t.state}
                  className="text-muted-foreground data-[state=completed]:text-primary data-[state=failed]:text-destructive font-medium"
                >
                  {t.state}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
