# Notifications

Task-completion notifications: a browser notification plus a sound when a
long-running task (lab, assessment, AI, voice) reaches a terminal state.

## Layers

| File                                           | Responsibility                                                                                                                            |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `notifications/index.ts`                       | Pure domain contract: `TaskEvent`, `NotificationPreferences`, `shouldNotify` policy, `describeTask` copy. No DOM, no storage.             |
| `client/src/lib/task-notifications.ts`         | Browser dispatch: Notification API + WebAudio chime, preference persistence (`localStorage`), permission handshake, page-lifetime de-dup. |
| `client/src/hooks/useTaskNotifications.ts`     | React state for preferences + permission.                                                                                                 |
| `client/src/hooks/useTaskWatcher.ts`           | Watches a task list, fires once per terminal transition.                                                                                  |
| `client/src/components/NotificationCenter.tsx` | Preferences panel (enable, sound, volume, failures, test).                                                                                |
| `client/src/pages/Notifications.tsx`           | Demo at `/notifications` with simulated tasks.                                                                                            |

## Contract rules

- **Non-blocking.** The UI never waits on a notification. Every browser call is
  guarded; a missing API, denied permission or autoplay block degrades silently.
- **Terminal only.** `queued` / `running` never notify. Terminal =
  `completed | failed | cancelled`.
- **De-duplicated** on `${id}:${state}` — safe to call on every render or poll.
- **Opt-in permission.** The OS prompt is only requested on an explicit user
  action ("Autorizar notificaciones").
- **Preferences** persist in `localStorage` under
  `secure-t.notifications.preferences`.

## Wiring a real task source

```ts
const { notify } = useTaskNotifications();
// tasks: TaskEvent[] from polling /api/labs, a WebSocket, or a query cache
useTaskWatcher(tasks, notify);
```

Map backend status to `TaskState` at the boundary; keep `id` stable across
transitions so de-dup and the "first terminal transition" detection work.

## Sound

Synthesised with WebAudio (`playChime`) — no audio asset to ship. Two rising
notes for success, two falling notes for failure, gated by the `sound` pref and
scaled by `volume` (0..1).
