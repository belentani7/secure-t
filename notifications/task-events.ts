export type TaskState = "TASK_CREATED" | "TASK_STARTED" | "TASK_PROGRESS" | "TASK_COMPLETED" | "TASK_FAILED";
export type TaskEvent = { taskId: string; type: TaskState; progress?: number; message?: string; occurredAt: string };
export function taskEvent(taskId: string, type: TaskState, details: Omit<TaskEvent, "taskId" | "type" | "occurredAt"> = {}): TaskEvent { return { taskId, type, ...details, occurredAt: new Date().toISOString() }; }
export function browserNotificationPayload(event: TaskEvent) { return { title: event.type === "TASK_COMPLETED" ? "Tarea completada" : event.type === "TASK_FAILED" ? "Tarea fallida" : "Secure T", body: event.message || `Estado: ${event.type}`, tag: event.taskId }; }
