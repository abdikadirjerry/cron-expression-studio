export interface CronParts {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export interface CronAnalysis {
  isValid: boolean;
  summary: string;
  error?: string;
  nextRuns: string[];
}

export interface CronPreset {
  id: string;
  label: string;
  expression: string;
  category: "Maintenance" | "Backup" | "Monitoring" | "Reporting";
  description: string;
}
