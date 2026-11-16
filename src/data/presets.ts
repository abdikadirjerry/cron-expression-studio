import type { CronPreset } from "../types/cron";

export const CRON_PRESETS: CronPreset[] = [
  {
    id: "pre-1",
    label: "Every 5 Minutes",
    expression: "*/5 * * * *",
    category: "Monitoring",
    description: "High-frequency health checks and telemetry polling.",
  },
  {
    id: "pre-2",
    label: "Nightly Database Backup",
    expression: "0 2 * * *",
    category: "Backup",
    description: "Executes automated PostgreSQL dump daily at 02:00 UTC.",
  },
  {
    id: "pre-3",
    label: "Weekly Log Rotation",
    expression: "30 3 * * 0",
    category: "Maintenance",
    description: "Compresses and archives server logs every Sunday at 03:30.",
  },
  {
    id: "pre-4",
    label: "Monthly Audit Digest",
    expression: "0 9 1 * *",
    category: "Reporting",
    description:
      "Dispatches security and uptime compliance report on the 1st of each month.",
  },
];
