import type { CronParts, CronAnalysis } from "../types/cron";

const FIELD_PATTERNS: Record<keyof CronParts, RegExp> = {
  minute:
    /^(\*|[0-5]?\d)(-[0-5]?\d)?(\/\d+)?(,(\*|[0-5]?\d)(-[0-5]?\d)?(\/\d+)?)*$/,
  hour: /^(\*|[01]?\d|2[0-3])(-([01]?\d|2[0-3]))?(\/\d+)?(,(\*|[01]?\d|2[0-3])(-([01]?\d|2[0-3]))?(\/\d+)?)*$/,
  dayOfMonth:
    /^(\*|[1-9]|[12]\d|3[01])(-([1-9]|[12]\d|3[01]))?(\/\d+)?(,(\*|[1-9]|[12]\d|3[01])(-([1-9]|[12]\d|3[01]))?(\/\d+)?)*$/,
  month:
    /^(\*|[1-9]|1[0-2])(-([1-9]|1[0-2]))?(\/\d+)?(,(\*|[1-9]|1[0-2])(-([1-9]|1[0-2]))?(\/\d+)?)*$/,
  dayOfWeek: /^(\*|[0-6])(-[0-6])?(\/\d+)?(,(\*|[0-6])(-[0-6])?(\/\d+)?)*$/,
};

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function parseExpression(expr: string): CronAnalysis {
  const tokens = expr.trim().split(/\s+/);
  if (tokens.length !== 5) {
    return {
      isValid: false,
      summary: "Invalid cron format",
      error: `Expected exactly 5 space-separated fields, got ${tokens.length}.`,
      nextRuns: [],
    };
  }

  const parts: CronParts = {
    minute: tokens[0],
    hour: tokens[1],
    dayOfMonth: tokens[2],
    month: tokens[3],
    dayOfWeek: tokens[4],
  };

  for (const [key, pattern] of Object.entries(FIELD_PATTERNS) as [
    keyof CronParts,
    RegExp,
  ][]) {
    if (!pattern.test(parts[key])) {
      return {
        isValid: false,
        summary: "Syntax error in schedule field",
        error: `Invalid token "${parts[key]}" in ${key} field.`,
        nextRuns: [],
      };
    }
  }

  const summary = buildHumanSummary(parts);
  const nextRuns = computeUpcomingRuns(parts, 5);

  return { isValid: true, summary, nextRuns };
}

function buildHumanSummary(p: CronParts): string {
  const minDesc =
    p.minute === "*"
      ? "every minute"
      : p.minute.startsWith("*/")
        ? `every ${p.minute.slice(2)} minutes`
        : `at minute ${p.minute}`;
  const hourDesc =
    p.hour === "*"
      ? "of every hour"
      : p.hour.startsWith("*/")
        ? `every ${p.hour.slice(2)} hours`
        : `past hour ${p.hour.padStart(2, "0")}:00`;
  const domDesc =
    p.dayOfMonth === "*" ? "" : `, on day ${p.dayOfMonth} of the month`;
  const monthDesc =
    p.month === "*"
      ? ""
      : `, in ${MONTHS[Number(p.month)] || `month ${p.month}`}`;
  const dowDesc =
    p.dayOfWeek === "*"
      ? ""
      : `, on ${DAYS[Number(p.dayOfWeek)] || `weekday ${p.dayOfWeek}`}`;

  return `Runs ${minDesc} ${hourDesc}${domDesc}${monthDesc}${dowDesc}.`;
}

function matchesField(value: number, token: string): boolean {
  if (token === "*") return true;
  if (token.startsWith("*/")) {
    const step = Number(token.slice(2));
    return step > 0 && value % step === 0;
  }
  return token.split(",").some((segment) => {
    if (segment.includes("-")) {
      const [start, end] = segment.split("-").map(Number);
      return value >= start && value <= end;
    }
    return Number(segment) === value;
  });
}

function computeUpcomingRuns(parts: CronParts, count: number): string[] {
  const runs: string[] = [];
  const cursor = new Date();
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  let iterations = 0;
  while (runs.length < count && iterations < 50000) {
    iterations++;
    if (
      matchesField(cursor.getMinutes(), parts.minute) &&
      matchesField(cursor.getHours(), parts.hour) &&
      matchesField(cursor.getDate(), parts.dayOfMonth) &&
      matchesField(cursor.getMonth() + 1, parts.month) &&
      matchesField(cursor.getDay(), parts.dayOfWeek)
    ) {
      runs.push(
        cursor.toLocaleString("en-GB", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
  }
  return runs;
}
