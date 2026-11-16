import React, { useState, useMemo } from "react";
import { parseExpression } from "../utils/cronParser";
import { CRON_PRESETS } from "../data/presets";

const FIELD_LABELS = [
  { name: "Minute", range: "0–59" },
  { name: "Hour", range: "0–23" },
  { name: "Day (Month)", range: "1–31" },
  { name: "Month", range: "1–12" },
  { name: "Day (Week)", range: "0–6 (Sun–Sat)" },
];

export const CronStudio: React.FC = () => {
  const [expression, setExpression] = useState<string>("*/15 * * * *");
  const [copied, setCopied] = useState<boolean>(false);

  const analysis = useMemo(() => parseExpression(expression), [expression]);
  const tokens = expression.trim().split(/\s+/);

  const handleCopy = () => {
    navigator.clipboard.writeText(expression.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="max-w-5xl w-full mx-auto p-6 md:p-10 space-y-8 font-mono">
      {/* Expression Input Card */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
              analysis.isValid
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-rose-500/10 text-rose-400 border-rose-500/30"
            }`}
          >
            {analysis.isValid ? "VALID CRON SYNTAX" : "INVALID EXPRESSION"}
          </span>

          <button
            onClick={handleCopy}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? "✓ Copied Expression" : "Copy Expression"}
          </button>
        </div>

        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          spellCheck={false}
          aria-label="Cron Expression"
          className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-xl px-5 py-4 text-2xl md:text-4xl font-black text-center tracking-[0.25em] text-amber-400 focus:outline-none"
        />

        {/* 5-Column Token Breakdown */}
        <div className="grid grid-cols-5 gap-2 text-center">
          {FIELD_LABELS.map((field, idx) => (
            <div
              key={field.name}
              className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3"
            >
              <div className="text-sm font-bold text-zinc-100">
                {tokens[idx] ?? "—"}
              </div>
              <div className="text-[10px] text-amber-400/90 font-semibold mt-1">
                {field.name}
              </div>
              <div className="text-[9px] text-zinc-500 mt-0.5">
                {field.range}
              </div>
            </div>
          ))}
        </div>

        {/* Translation Banner */}
        <div
          className={`p-4 rounded-xl border text-xs leading-relaxed ${
            analysis.isValid
              ? "bg-zinc-950 border-zinc-800 text-zinc-200"
              : "bg-rose-950/30 border-rose-500/30 text-rose-300"
          }`}
        >
          {analysis.isValid ? analysis.summary : analysis.error}
        </div>
      </section>

      {/* Bottom Split: Presets & Next Execution Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Presets */}
        <section className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Quick Schedule Presets
          </h2>
          <div className="space-y-2.5">
            {CRON_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setExpression(preset.expression)}
                className="w-full text-left bg-zinc-950 hover:bg-zinc-800/70 border border-zinc-800 hover:border-amber-500/40 rounded-xl p-3.5 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-100">
                    {preset.label}
                  </span>
                  <code className="text-[11px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                    {preset.expression}
                  </code>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Next Executions */}
        <section className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Next 5 Scheduled Runs
          </h2>
          {analysis.isValid && analysis.nextRuns.length > 0 ? (
            <ol className="space-y-2.5">
              {analysis.nextRuns.map((runTime, idx) => (
                <li
                  key={idx}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between text-xs"
                >
                  <span className="text-zinc-500 font-bold">#{idx + 1}</span>
                  <span className="text-emerald-400 font-semibold">
                    {runTime}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-center py-12 text-xs text-zinc-500">
              Enter a valid cron expression to preview upcoming execution
              timestamps.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
