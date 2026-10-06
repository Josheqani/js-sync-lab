import React from 'react';
import { motion } from 'framer-motion';
import type { StepState } from '../types';
import { Lightbulb, Compass } from 'lucide-react';


interface StepExplanationProps {
  stepState: StepState;
}

export const StepExplanation: React.FC<StepExplanationProps> = ({ stepState }) => {
  return (
    <motion.div
      key={stepState.stepIndex}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-slate-800 bg-[#0d1117] p-5 shadow-xl flex flex-col gap-4"
    >
      {/* Title & Description */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Compass className="w-4 h-4" />
          </span>
          <h3 className="text-base font-bold text-white tracking-tight">
            {stepState.title}
          </h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed pl-7">
          {stepState.description}
        </p>
      </div>

      {/* 3 Technical Status Pills & Takeaway */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs flex flex-col gap-1">
          <span className="font-semibold text-sky-400 font-mono text-[11px] uppercase tracking-wider">
            Call Stack
          </span>
          <p className="text-slate-300 text-[11.5px] leading-relaxed">
            {stepState.deepDive.callStackAction}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs flex flex-col gap-1">
          <span className="font-semibold text-amber-400 font-mono text-[11px] uppercase tracking-wider">
            Web APIs / Queues
          </span>
          <p className="text-slate-300 text-[11.5px] leading-relaxed">
            {stepState.deepDive.webApiAction}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs flex flex-col gap-1">
          <span className="font-semibold text-fuchsia-400 font-mono text-[11px] uppercase tracking-wider">
            Event Loop
          </span>
          <p className="text-slate-300 text-[11.5px] leading-relaxed">
            {stepState.deepDive.eventLoopAction}
          </p>
        </div>
      </div>

      {/* Takeaway Alert Box */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/20 border border-cyan-500/30">
        <Lightbulb className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-cyan-300 block mb-0.5 font-mono uppercase tracking-wider text-[10px]">
            Key Concept to Remember
          </span>
          <span className="text-slate-200 leading-relaxed font-medium">
            {stepState.deepDive.takeaway}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
