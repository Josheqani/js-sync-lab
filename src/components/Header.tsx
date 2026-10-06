import React from 'react';
import { SCENARIOS } from '../data/scenarios';
import type { Scenario } from '../types';
import { Layers, Split, Code2, ArrowLeftRight } from 'lucide-react';


interface HeaderProps {
  currentScenario: Scenario;
  onSelectScenario: (scenario: Scenario) => void;
  codePosition: 'left' | 'right';
  onToggleCodePosition: () => void;
  viewMode: 'standard' | 'split-compare';
  onToggleViewMode: (mode: 'standard' | 'split-compare') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScenario,
  onSelectScenario,
  codePosition,
  onToggleCodePosition,
  viewMode,
  onToggleViewMode,
}) => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-800 bg-[#0d1117] shadow-xl">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-cyan-500/20">
          <Code2 className="w-5 h-5 text-slate-950" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-white tracking-tight">
              JS Sync vs Async Lab
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
              Interactive Runtime
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Visualizing Call Stack, Web APIs, Event Loop & Line Swapping
          </p>
        </div>
      </div>

      {/* Scenario Selector Dropdown / Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-[#161b22] rounded-xl border border-slate-800">
          {SCENARIOS.map((sc) => {
            const isSelected = sc.id === currentScenario.id;
            return (
              <button
                key={sc.id}
                onClick={() => onSelectScenario(sc)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? sc.type === 'async'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold'
                      : 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {sc.title.split(':')[0]}
              </button>
            );
          })}
        </div>

        {/* View mode toggle (Standard vs Split Compare) */}
        <div className="flex items-center gap-1 p-1 bg-[#161b22] rounded-xl border border-slate-800">
          <button
            onClick={() => onToggleViewMode('standard')}
            title="Single scenario deep dive"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'standard'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Engine View</span>
          </button>

          <button
            onClick={() => onToggleViewMode('split-compare')}
            title="Side-by-side Sync vs Async comparison"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'split-compare'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Side-by-Side</span>
          </button>
        </div>

        {/* Code Position toggle (Left vs Right) */}
        {viewMode === 'standard' && (
          <button
            onClick={onToggleCodePosition}
            title={`Move Code Panel to ${codePosition === 'left' ? 'Right' : 'Left'}`}
            className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-800 bg-[#161b22] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-mono"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
            <span>Code on {codePosition === 'left' ? 'Left' : 'Right'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
