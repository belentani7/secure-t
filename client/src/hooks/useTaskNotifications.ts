import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getPermission,
  loadPreferences,
  notifyTask,
  requestPermission,
  savePreferences,
  testNotification,
  type PermissionState,
} from "@/lib/task-notifications";
import {
  clampVolume,
  type NotificationPreferences,
  type TaskEvent,
} from "@notifications";

export interface UseTaskNotifications {
  preferences: NotificationPreferences;
  permission: PermissionState;
  supported: boolean;
  setPreferences: (patch: Partial<NotificationPreferences>) => void;
  enable: () => Promise<void>;
  notify: (event: TaskEvent) => void;
  sendTest: () => void;
}

/** Owns notification preferences (persisted) and the OS permission handshake. */
export function useTaskNotifications(): UseTaskNotifications {
  const [preferences, setPreferencesState] = useState<NotificationPreferences>(
    () => loadPreferences()
  );
  const [permission, setPermission] = useState<PermissionState>(() =>
    getPermission()
  );

  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  const setPreferences = useCallback(
    (patch: Partial<NotificationPreferences>) => {
      setPreferencesState(prev => ({
        ...prev,
        ...patch,
        volume:
          patch.volume === undefined ? prev.volume : clampVolume(patch.volume),
      }));
    },
    []
  );

  const enable = useCallback(async () => {
    const next = await requestPermission();
    setPermission(next);
    if (next === "granted") setPreferences({ enabled: true });
  }, [setPreferences]);

  const notify = useCallback(
    (event: TaskEvent) => {
      notifyTask(event, preferences);
    },
    [preferences]
  );

  const sendTest = useCallback(() => {
    testNotification(preferences);
  }, [preferences]);

  return useMemo(
    () => ({
      preferences,
      permission,
      supported: permission !== "unsupported",
      setPreferences,
      enable,
      notify,
      sendTest,
    }),
    [preferences, permission, setPreferences, enable, notify, sendTest]
  );
}
