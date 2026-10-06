import React, { useState, useEffect } from 'react';
import { SCENARIOS } from '../data/scenarios';
import { CodeViewer } from './CodeViewer';
import { ConsoleOutput } from './ConsoleOutput';
import { PlaybackControls } from './PlaybackControls';

export const SplitCompareView: React.FC = () => {
  const syncScenario = SCENARIOS.find((s) => s.id === 'sync-basic') || SCENARIOS[1];
  const asyncScenario = SCENARIOS.find((s) => s.id === 'async-basic') || SCENARIOS[0];

  const [syncStep, setSyncStep] = useState(0);
  const [asyncStep, setAsyncStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const maxSteps = Math.max(syncScenario.steps.length, asyncScenario.steps.length);

  // Playback timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      const intervalMs = 1800 / speed;
      timer = setInterval(() => {
        setSyncStep((prev) => {
          if (prev < syncScenario.steps.length - 1) return prev + 1;
          return prev;
        });
        setAsyncStep((prev) => {
          if (prev < asyncScenario.steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, syncScenario.steps.length, asyncScenario.steps.length]);

  const handleNext = () => {
    setSyncStep((p) => Math.min(p + 1, syncScenario.steps.length - 1));
    setAsyncStep((p) => Math.min(p + 1, asyncScenario.steps.length - 1));
  };

  const handlePrev = () => {
    setSyncStep((p) => Math.max(p - 1, 0));
    setAsyncStep((p) => Math.max(p - 1, 0));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSyncStep(0);
    setAsyncStep(0);
  };

  const handleStepSelect = (step: number) => {
    setSyncStep(Math.min(step, syncScenario.steps.length - 1));
    setAsyncStep(Math.min(step, asyncScenario.steps.length - 1));
  };

  const currentSyncState = syncScenario.steps[syncStep];
  const currentAsyncState = asyncScenario.steps[asyncStep];

  return (
    <div className="flex flex-col gap-4">
      {/* Comparison Infobar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sync Info Header */}
        <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-950/20 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase">
              Synchronous Execution
            </span>
            <span className="text-xs font-mono text-slate-400">
              Active Line: {currentSyncState.activeLineNumber || 'None'}
            </span>
          </div>
          <h3 className="text-sm font-bold text-white mb-1">
            Sequential & Blocking
          </h3>
          <p className="text-xs text-slate-300">
            Lines execute strictly top-to-bottom: 1 &rarr; 2 &rarr; 3 &rarr; 4 &rarr; 5. Output order is always preserved.
          </p>
        </div>

        {/* Async Info Header */}
        <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-950/20 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
              Asynchronous Execution
            </span>
            <span className="text-xs font-mono text-slate-400">
              Active Line: {currentAsyncState.activeLineNumber || 'None'}
            </span>
          </div>
          <h3 className="text-sm font-bold text-white mb-1">
            Non-Blocking & Event Loop Swapping
          </h3>
          <p className="text-xs text-slate-300">
            Line 2 registers timer &rarr; <strong className="text-sky-300">jumps to Line 5</strong> &rarr; stack clears &rarr; <strong className="text-fuchsia-300">swaps back to Line 3</strong>!
          </p>
        </div>
      </div>

      {/* Code Editors Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[380px]">
        {/* Left: Synchronous Code */}
        <div className="flex flex-col h-full">
          <CodeViewer
            lines={syncScenario.lines}
            stepState={currentSyncState}
            title="synchronous-flow.js"
            isAsync={false}
          />
        </div>

        {/* Right: Asynchronous Code */}
        <div className="flex flex-col h-full">
          <CodeViewer
            lines={asyncScenario.lines}
            stepState={currentAsyncState}
            title="asynchronous-flow.js"
            isAsync={true}
          />
        </div>
      </div>

      {/* Controls */}
      <PlaybackControls
        currentStep={Math.max(syncStep, asyncStep)}
        totalSteps={maxSteps}
        isPlaying={isPlaying}
        speed={speed}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={handleNext}
        onPrev={handlePrev}
        onReset={handleReset}
        onSpeedChange={setSpeed}
        onStepSelect={handleStepSelect}
      />

      {/* Consoles Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ConsoleOutput logs={currentSyncState.consoleLogs} />
        <ConsoleOutput logs={currentAsyncState.consoleLogs} />
      </div>
    </div>
  );
};
