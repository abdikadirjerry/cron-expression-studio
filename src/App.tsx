import React from "react";
import { CronStudio } from "./components/CronStudio";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-400 selection:text-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-900/80 px-6 md:px-10 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center font-black text-xs">
            * *
          </div>
          <div>
            <h1 className="text-xs font-bold uppercase tracking-wider text-zinc-100">
              CronStudio // Unix Schedule Inspector
            </h1>
            <p className="text-[10px] text-zinc-500">
              REACT + TYPESCRIPT + TAILWIND CSS
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-zinc-400 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg">
          POSIX 5-Field Standard
        </span>
      </header>

      <main className="flex-1 flex flex-col justify-center">
        <CronStudio />
      </main>
    </div>
  );
};

export default App;
