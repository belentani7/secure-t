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
import { useTranslation } from "@/lib/i18n";
import type { UseTaskNotifications } from "@/hooks/useTaskNotifications";

/** Preferences panel for task-completion notifications and sound. */
export function NotificationCenter({
  controller,
}: {
  controller: UseTaskNotifications;
}) {
  const { t } = useTranslation();
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
          {t("notifications.title")}
        </CardTitle>
        <CardDescription>
          {t("notifications.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="notif-enabled">{t("notifications.enable_label")}</Label>
            <p className="text-muted-foreground text-sm">
              {t(`notifications.perm_${permission}`)}
            </p>
          </div>
          <Switch
            id="notif-enabled"
            checked={preferences.enabled}
            onCheckedChange={v => setPreferences({ enabled: v })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notif-sound">{t("notifications.sound_label")}</Label>
          <Switch
            id="notif-sound"
            checked={preferences.sound}
            onCheckedChange={v => setPreferences({ sound: v })}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Volume2 className="size-4" /> {t("notifications.volume_label")}
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
            <Label htmlFor="notif-failures">{t("notifications.failures_label")}</Label>
            <p className="text-muted-foreground text-sm">
              {t("notifications.failures_desc")}
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
              {t("notifications.authorize_button")}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={sendTest}
            disabled={!preferences.enabled}
          >
            {t("notifications.test_button")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
