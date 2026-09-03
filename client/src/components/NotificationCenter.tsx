import { Bell, BellOff, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { UseTaskNotifications } from "@/hooks/useTaskNotifications";

const PERMISSION_COPY: Record<string, string> = {
  unsupported: "Este navegador no admite notificaciones de escritorio.",
  default: "Autoriza las notificaciones para recibir avisos del sistema.",
  granted: "Notificaciones autorizadas.",
  denied: "Notificaciones bloqueadas en los ajustes del navegador.",
};

/** Preferences panel for task-completion notifications and sound. */
export function NotificationCenter({
  controller,
}: {
  controller: UseTaskNotifications;
}) {
  const {
    preferences,
    permission,
    supported,
    setPreferences,
    enable,
    sendTest,
  } = controller;
  const needsPermission = supported && permission !== "granted";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {preferences.enabled ? (
            <Bell className="size-4" />
          ) : (
            <BellOff className="size-4" />
          )}
          Notificaciones de tareas
        </CardTitle>
        <CardDescription>
          Recibe un aviso del navegador y un sonido cuando una tarea
          (laboratorio, evaluación, asistente) termina.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="notif-enabled">Activar avisos</Label>
            <p className="text-muted-foreground text-sm">
              {PERMISSION_COPY[permission]}
            </p>
          </div>
          <Switch
            id="notif-enabled"
            checked={preferences.enabled}
            onCheckedChange={v => setPreferences({ enabled: v })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notif-sound">Sonido</Label>
          <Switch
            id="notif-sound"
            checked={preferences.sound}
            onCheckedChange={v => setPreferences({ sound: v })}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Volume2 className="size-4" /> Volumen
          </Label>
          <Slider
            min={0}
            max={100}
            step={5}
            value={[Math.round(preferences.volume * 100)]}
            onValueChange={([v]) => setPreferences({ volume: v / 100 })}
            disabled={!preferences.sound}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="notif-failures">Avisar también de fallos</Label>
            <p className="text-muted-foreground text-sm">
              Tareas fallidas o canceladas.
            </p>
          </div>
          <Switch
            id="notif-failures"
            checked={preferences.includeFailures}
            onCheckedChange={v => setPreferences({ includeFailures: v })}
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          {needsPermission && (
            <Button
              onClick={() => void enable()}
              disabled={permission === "denied" || !supported}
            >
              Autorizar notificaciones
            </Button>
          )}
          <Button
            variant="outline"
            onClick={sendTest}
            disabled={!preferences.enabled}
          >
            Probar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
