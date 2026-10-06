import React from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';

interface PlaybackControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onStepSelect: (step: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPlayPause,
  onNext,
  onPrev,
  onReset,
  onSpeedChange,
  onStepSelect,
}) => {
  const speeds = [0.5, 1, 1.5, 2];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-800 bg-[#0d1117] shadow-xl">
      {/* Primary Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Reset */}
        <button
          onClick={onReset}
          title="Reset to beginning (R)"
          className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Step Back */}
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          title="Step backward (Left Arrow)"
          className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 shadow-sm"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Play / Pause Primary Button */}
        <button
          onClick={onPlayPause}
          title={isPlaying ? 'Pause (Space)' : 'Auto Play (Space)'}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all active:scale-95 shadow-lg ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-amber-500/20'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-cyan-500/20'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Auto Play</span>
            </>
          )}
        </button>

        {/* Step Forward */}
        <button
          onClick={onNext}
          disabled={currentStep >= totalSteps - 1}
          title="Step forward (Right Arrow)"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/90 text-white hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 font-medium text-sm shadow-sm"
        >
          <span>Step</span>
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Step scrubber dots */}
      <div className="flex items-center gap-1.5 max-w-full overflow-x-auto py-1 px-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index === currentStep;
          const isPassed = index < currentStep;
          return (
            <button
              key={index}
              onClick={() => onStepSelect(index)}
              title={`Jump to step ${index}`}
              className={`h-2.5 rounded-full transition-all ${
                isActive
                  ? 'w-7 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                  : isPassed
                  ? 'w-2.5 bg-cyan-800/70 hover:bg-cyan-700'
                  : 'w-2.5 bg-slate-800 hover:bg-slate-700'
              }`}
            />
          );
        })}
        <span className="text-xs font-mono text-slate-400 ml-2 shrink-0">
          Step {currentStep} / {totalSteps - 1}
        </span>
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-1 bg-[#161b22] p-1 rounded-xl border border-slate-800">
        <span className="text-[10px] font-mono text-slate-400 px-2 uppercase font-semibold">
          Speed
        </span>
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
              speed === s
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
};
