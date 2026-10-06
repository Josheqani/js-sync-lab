import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ConsoleLogEntry } from '../types';
import { Terminal, Copy, Check } from 'lucide-react';

interface ConsoleOutputProps {
  logs: ConsoleLogEntry[];
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ logs }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = logs.map((l) => `[${l.timestamp}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-[#0d1117] shadow-xl overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-mono font-semibold text-slate-200">
            Console Output / Stdout
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {logs.length} logged
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={logs.length === 0}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 disabled:opacity-40 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Stream */}
      <div className="flex-1 p-3 font-mono text-xs overflow-y-auto space-y-1.5 bg-[#090d16] min-h-[120px]">
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-600">
              <span className="text-xs">No output generated yet</span>
              <span className="text-[11px] text-slate-700 mt-1">
                Press "Step" or "Play" to start execution
              </span>
            </div>
          ) : (
            logs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-2.5 py-1 px-2 rounded-lg bg-slate-900/40 hover:bg-slate-900/80 transition-colors border border-slate-800/60"
              >
                {/* Log Index */}
                <span className="text-slate-600 text-[10px] select-none pt-0.5 w-4 text-right">
                  {index + 1}
                </span>

                {/* Badge Type */}
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 select-none ${
                    log.type === 'sync'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                      : log.type === 'async'
                      ? 'bg-fuchsia-950/60 text-fuchsia-300 border border-fuchsia-500/30'
                      : log.type === 'microtask'
                      ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {log.type}
                </span>

                {/* Message */}
                <span className="flex-1 text-slate-200 font-medium select-text break-all">
                  {log.message}
                </span>

                {/* Timestamp & Line info */}
                <div className="flex items-center gap-2 shrink-0 select-none text-[10px] text-slate-500 font-mono">
                  <span>Line {log.lineNumber}</span>
                  <span className="text-slate-700">•</span>
                  <span>{log.timestamp}</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer hint */}
      <div className="px-3 py-1.5 bg-[#0d1117] border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Standard stream</span>
        </div>
        <span>Chronological Order</span>
      </div>
    </div>
  );
};
