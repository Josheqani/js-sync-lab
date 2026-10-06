import React from 'react';
import { motion } from 'framer-motion';
import type { CodeLine, StepState } from '../types';

import { Terminal, Copy, Check, Sparkles, ArrowRight, Clock, Zap } from 'lucide-react';

interface CodeViewerProps {
  lines: CodeLine[];
  stepState: StepState;
  title?: string;
  isAsync?: boolean;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  lines,
  stepState,
  title,
  isAsync = false,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const raw = lines.map((l) => l.rawText).join('\n');
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getReasonBadge = () => {
    switch (stepState.highlightReason) {
      case 'sync-exec':
        return {
          label: 'EXEC SYNC',
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
          dot: 'bg-emerald-400',
          icon: <Zap className="w-3 h-3 text-emerald-400" />,
        };
      case 'async-register':
        return {
          label: 'OFFLOAD TO WEB API',
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
          dot: 'bg-amber-400 animate-pulse',
          icon: <Clock className="w-3 h-3 text-amber-400" />,
        };
      case 'jump-skip':
        return {
          label: 'JUMPED AHEAD (NON-BLOCKING)',
          bg: 'bg-sky-500/15 border-sky-500/40 text-sky-300',
          dot: 'bg-sky-400',
          icon: <ArrowRight className="w-3 h-3 text-sky-400" />,
        };
      case 'callback-exec':
        return {
          label: 'CALLBACK FROM QUEUE',
          bg: 'bg-fuchsia-500/15 border-fuchsia-500/40 text-fuchsia-300',
          dot: 'bg-fuchsia-400 animate-ping',
          icon: <Sparkles className="w-3 h-3 text-fuchsia-400" />,
        };
      default:
        return null;
    }
  };

  const badge = getReasonBadge();

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-[#0d1117] shadow-2xl overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block shadow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block shadow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block shadow-sm"></span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-mono font-medium text-slate-300">
              {title || (isAsync ? 'async-demo.js' : 'sync-demo.js')}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={badge.label}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border shadow-sm ${badge.bg}`}
            >
              {badge.icon}
              <span>{badge.label}</span>
            </motion.div>
          )}

          <div
            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${
              isAsync
                ? 'bg-purple-950/60 border-purple-600/40 text-purple-300'
                : 'bg-blue-950/60 border-blue-600/40 text-blue-300'
            }`}
          >
            {isAsync ? 'Asynchronous Flow' : 'Synchronous Flow'}
          </div>

          <button
            onClick={handleCopy}
            title="Copy code"
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 p-4 font-mono text-[13.5px] leading-relaxed select-none overflow-x-auto bg-[#090d16]">
        <div className="relative flex flex-col min-w-full">
          {lines.map((line) => {
            const isActive = stepState.activeLineNumber === line.lineNumber;
            return (
              <div
                key={line.lineNumber}
                className="relative flex items-center group py-1.5 transition-colors"
              >
                {/* Motion Animated Active Line Highlight */}
                {isActive && (
                  <motion.div
                    layoutId={`active-highlight-${isAsync ? 'async' : 'sync'}`}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 32,
                      mass: 0.8,
                    }}
                    className={`absolute inset-0 -mx-4 rounded-lg border-l-4 z-0 pointer-events-none ${
                      stepState.highlightReason === 'async-register'
                        ? 'bg-amber-500/10 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                        : stepState.highlightReason === 'jump-skip'
                        ? 'bg-sky-500/10 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.15)]'
                        : stepState.highlightReason === 'callback-exec'
                        ? 'bg-fuchsia-500/10 border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.15)]'
                        : 'bg-emerald-500/10 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
                    }`}
                  />
                )}

                {/* Line Number Gutter */}
                <div
                  className={`w-9 shrink-0 text-right pr-4 text-xs select-none font-mono transition-colors z-10 ${
                    isActive
                      ? 'text-cyan-300 font-bold'
                      : 'text-slate-600 group-hover:text-slate-400'
                  }`}
                >
                  {line.lineNumber}
                </div>

                {/* Execution Pointer Arrow */}
                <div className="w-5 shrink-0 flex items-center justify-center z-10">
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, x: -6 }}
                      animate={{ scale: 1, x: 0 }}
                      className={`w-2.5 h-2.5 rounded-full ${
                        stepState.highlightReason === 'async-register'
                          ? 'bg-amber-400 ring-4 ring-amber-400/20'
                          : stepState.highlightReason === 'jump-skip'
                          ? 'bg-sky-400 ring-4 ring-sky-400/20'
                          : stepState.highlightReason === 'callback-exec'
                          ? 'bg-fuchsia-400 ring-4 ring-fuchsia-400/20'
                          : 'bg-emerald-400 ring-4 ring-emerald-400/20'
                      }`}
                    />
                  )}
                </div>

                {/* Code Tokens */}
                <div className="relative z-10 flex-1 whitespace-pre pl-1">
                  {line.tokens.map((token, idx) => (
                    <span
                      key={idx}
                      className={getTokenClassName(token.type, isActive)}
                    >
                      {token.text}
                    </span>
                  ))}
                </div>

                {/* Inline Comment / Annotation */}
                {line.description && (
                  <div
                    className={`ml-4 text-xs hidden lg:block transition-opacity z-10 ${
                      isActive ? 'text-slate-400 opacity-90' : 'text-slate-600 opacity-40 group-hover:opacity-75'
                    }`}
                  >
                    // {line.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor Status Footer */}
      <div className="px-4 py-2 bg-[#090d16] border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                stepState.activeLineNumber ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
              }`}
            />
            {stepState.activeLineNumber
              ? `Line ${stepState.activeLineNumber} Active`
              : 'Stack Cleared / Idle'}
          </span>
          <span className="text-slate-600">|</span>
          <span>UTF-8</span>
          <span className="text-slate-600">|</span>
          <span>JavaScript</span>
        </div>
        <div className="text-slate-500">Read-Only Source</div>
      </div>
    </div>
  );
};

function getTokenClassName(type: string, isLineActive: boolean): string {
  switch (type) {
    case 'keyword':
      return 'text-fuchsia-400 font-semibold';
    case 'function':
      return 'text-sky-300 font-medium';
    case 'string':
      return 'text-emerald-300';
    case 'number':
      return 'text-amber-300';
    case 'comment':
      return 'text-slate-500 italic';
    case 'operator':
      return 'text-pink-400';
    case 'punctuation':
      return 'text-slate-400';
    case 'variable':
      return isLineActive ? 'text-white' : 'text-slate-200';
    default:
      return 'text-slate-300';
  }
}
