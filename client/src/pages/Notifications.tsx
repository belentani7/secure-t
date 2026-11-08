import { useCallback, useState } from "react";
import { toast } from "sonner";

import { NotificationCenter } from "@/components/NotificationCenter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskNotifications } from "@/hooks/useTaskNotifications";
import { useTaskWatcher } from "@/hooks/useTaskWatcher";
import { describeTask, type TaskEvent, type TaskKind } from "@notifications";
import { useTranslation } from "@/lib/i18n";

const SAMPLES: { kind: TaskKind; key: string; failRate: number }[] = [
  {
    kind: "lab",
    key: "notifications.triage_alert",
    failRate: 0.15,
  },
  {
    kind: "assessment",
    key: "notifications.capstone_soc",
    failRate: 0.1,
  },
  { kind: "ai", key: "notifications.ai_synthesis", failRate: 0.05 },
];

let counter = 0;

/** Demo surface: launch simulated tasks and see the completion notification. */
export default function Notifications() {
  const { t } = useTranslation();
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
      label: t(sample.key),
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
            ? t("notifications.detail_failed")
            : t("notifications.detail_completed"),
        });
      },
      2600 + Math.random() * 1500
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">{t("notifications.title")}</h1>
        <p className="text-muted-foreground">
          {t("notifications.subtitle")}
        </p>
      </header>

      <NotificationCenter controller={controller} />

      <Card>
        <CardHeader>
          <CardTitle>{t("notifications.card_title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {SAMPLES.map(s => (
              <Button
                key={s.key}
                variant="secondary"
                onClick={() => launch(s)}
              >
                {t("notifications.launch", { label: t(s.key) })}
              </Button>
            ))}
          </div>

          <ul className="divide-border divide-y rounded-md border">
            {tasks.length === 0 && (
              <li className="text-muted-foreground p-3 text-sm">
                {t("notifications.empty")}
              </li>
            )}
            {tasks.map(task => (
              <li
                key={task.id}
                className="flex items-center justify-between p-3 text-sm"
              >
                <span>{task.label}</span>
                <span
                  data-state={task.state}
                  className="text-muted-foreground data-[state=completed]:text-primary data-[state=failed]:text-destructive font-medium"
                >
                  {t(`notifications.state.${task.state}`)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
