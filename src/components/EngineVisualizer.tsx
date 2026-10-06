import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StepState } from '../types';

import { Layers, Globe, ListFilter, RefreshCw, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

interface EngineVisualizerProps {
  stepState: StepState;
}

export const EngineVisualizer: React.FC<EngineVisualizerProps> = ({ stepState }) => {
  const isLoopTransferring = stepState.eventLoopStatus === 'transferring';
  const isLoopBlocked = stepState.eventLoopStatus === 'blocked';

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Top Row: Call Stack & Web APIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* 1. CALL STACK */}
        <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#0d1117] p-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  Call Stack
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    LIFO
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Single thread execution</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              <span>{stepState.callStack.length} frame(s)</span>
            </div>
          </div>

          {/* Stack Containers (bottom to top) */}
          <div className="flex-1 flex flex-col-reverse justify-start gap-2 overflow-y-auto p-1 min-h-[140px]">
            <AnimatePresence mode="popLayout">
              {stepState.callStack.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-xl"
                >
                  <ShieldCheck className="w-7 h-7 text-emerald-500/60 mb-2" />
                  <span className="text-xs font-medium text-slate-400">
                    Call Stack is Empty
                  </span>
                  <span className="text-[10px] text-slate-600 mt-0.5">
                    Main thread free to receive next task
                  </span>
                </motion.div>
              ) : (
                stepState.callStack.map((frame) => (
                  <motion.div
                    key={frame.id}
                    layout
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono shadow-md ${
                      frame.type === 'callback'
                        ? 'bg-fuchsia-950/40 border-fuchsia-500/40 text-fuchsia-200'
                        : frame.type === 'microtask'
                        ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                        : frame.type === 'async-reg'
                        ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                        : 'bg-sky-950/40 border-sky-500/40 text-sky-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                      <span className="truncate font-semibold">{frame.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-slate-300">
                        line {frame.line}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 2. WEB APIS / BROWSER RUNTIME */}
        <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#0d1117] p-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  Browser Web APIs
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-500/20">
                    Background
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Timers, Fetch, DOM events</p>
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              {stepState.webApis.length} active
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2 overflow-y-auto p-1 min-h-[140px]">
            <AnimatePresence mode="popLayout">
              {stepState.webApis.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-xl"
                >
                  <Globe className="w-7 h-7 text-slate-700 mb-2" />
                  <span className="text-xs font-medium text-slate-500">
                    No active Web API background tasks
                  </span>
                  <span className="text-[10px] text-slate-600 mt-0.5">
                    Async tasks appear here while pending
                  </span>
                </motion.div>
              ) : (
                stepState.webApis.map((api) => (
                  <motion.div
                    key={api.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="p-3 rounded-xl border border-amber-500/30 bg-amber-950/20 text-xs shadow-md"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-amber-300 font-mono">
                        {api.label}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {api.remainingMs === 0 ? 'READY' : `${api.remainingMs}ms left`}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-300 truncate mb-2">
                      Callback: {api.callbackName}
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-amber-500 to-orange-400 h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${api.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Middle Connector: Event Loop status bar */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-800 bg-[#161b22]/70 shadow-sm">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: isLoopBlocked ? 0 : 360,
              scale: isLoopTransferring ? [1, 1.25, 1] : 1,
            }}
            transition={{
              rotate: { repeat: Infinity, duration: 4, ease: 'linear' },
              scale: { repeat: Infinity, duration: 1 },
            }}
            className={`p-1.5 rounded-lg border ${
              isLoopBlocked
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : isLoopTransferring
                ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40 shadow-[0_0_12px_rgba(217,70,239,0.4)]'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}
          >
            {isLoopBlocked ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </motion.div>
          <div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <span>Event Loop Monitor</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                  isLoopBlocked
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : isLoopTransferring
                    ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {stepState.eventLoopStatus}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              {isLoopBlocked
                ? 'Main thread blocked by heavy synchronous execution!'
                : isLoopTransferring
                ? 'Stack is clear! Moving queued callback into Call Stack.'
                : 'Monitoring Call Stack & Queues constantly.'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Microtask Queue & Macrotask (Callback) Queue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* Microtask Queue (Promises) */}
        <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#0d1117] p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <ListFilter className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-semibold text-slate-200">
                Microtask Queue
              </h4>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
              HIGH PRIORITY
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-1.5 min-h-[90px] p-1">
            <AnimatePresence mode="popLayout">
              {stepState.microtaskQueue.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-2 text-[11px] text-slate-600 border border-dashed border-slate-800/80 rounded-xl">
                  Microtask Queue empty (Promises)
                </div>
              ) : (
                stepState.microtaskQueue.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="p-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/30 text-xs font-mono text-cyan-200 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      <span className="font-semibold truncate">{item.name}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-cyan-300 border border-cyan-500/20">
                      Line {item.targetLine}
                    </span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Macrotask Queue (setTimeout, setInterval) */}
        <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#0d1117] p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <ListFilter className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-semibold text-slate-200">
                Task (Macrotask) Queue
              </h4>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              STANDARD PRIORITY
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-1.5 min-h-[90px] p-1">
            <AnimatePresence mode="popLayout">
              {stepState.taskQueue.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-2 text-[11px] text-slate-600 border border-dashed border-slate-800/80 rounded-xl">
                  Task Queue empty (Timers, I/O)
                </div>
              ) : (
                stepState.taskQueue.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="p-2.5 rounded-xl border border-purple-500/40 bg-purple-950/30 text-xs font-mono text-purple-200 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span className="font-semibold truncate">{item.name}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-purple-300 border border-purple-500/20">
                      Line {item.targetLine}
                    </span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
