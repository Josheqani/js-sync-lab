import { useState, useEffect, useCallback } from 'react';
import { SCENARIOS } from './data/scenarios';
import type { Scenario } from './types';
import { Header } from './components/Header';
import { CodeViewer } from './components/CodeViewer';
import { EngineVisualizer } from './components/EngineVisualizer';
import { ConsoleOutput } from './components/ConsoleOutput';
import { PlaybackControls } from './components/PlaybackControls';
import { StepExplanation } from './components/StepExplanation';
import { SplitCompareView } from './components/SplitCompareView';
import { ArrowLeftRight } from 'lucide-react';

export default function App() {
  const [currentScenario, setCurrentScenario] = useState<Scenario>(SCENARIOS[0]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [codePosition, setCodePosition] = useState<'left' | 'right'>('left');
  const [viewMode, setViewMode] = useState<'standard' | 'split-compare'>('standard');

  const currentStepState = currentScenario.steps[stepIndex] || currentScenario.steps[0];
  const totalSteps = currentScenario.steps.length;

  // Auto-play timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      const delayMs = 2200 / speed;
      timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev < totalSteps - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, delayMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, totalSteps]);

  // Handle Scenario Switch
  const handleSelectScenario = (scenario: Scenario) => {
    setIsPlaying(false);
    setCurrentScenario(scenario);
    setStepIndex(0);
  };

  const handleNext = useCallback(() => {
    setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const handlePrev = useCallback(() => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setStepIndex(0);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if user is in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleReset]);

  // Quick switch to paired scenario (e.g. sync-basic <-> async-basic)
  const pairedScenario = SCENARIOS.find(
    (s) => s.id === currentScenario.comparisonScenarioId
  );

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col p-3 md:p-6 lg:p-8 selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="max-w-[1720px] w-full mx-auto flex flex-col gap-5 flex-1">
        {/* App Header */}
        <Header
          currentScenario={currentScenario}
          onSelectScenario={handleSelectScenario}
          codePosition={codePosition}
          onToggleCodePosition={() =>
            setCodePosition((p) => (p === 'left' ? 'right' : 'left'))
          }
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
        />

        {/* View Mode Switch */}
        {viewMode === 'split-compare' ? (
          <SplitCompareView />
        ) : (
          <div className="flex flex-col gap-5">
            {/* Context Notice & Paired Switcher */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-[#0e1626] border border-slate-800 shadow-md">
              <div className="flex items-center gap-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    currentScenario.type === 'async'
                      ? 'bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)]'
                      : 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]'
                  }`}
                />
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    {currentScenario.title}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {currentScenario.difficulty}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    {currentScenario.subtitle}
                  </p>
                </div>
              </div>

              {pairedScenario && (
                <button
                  onClick={() => handleSelectScenario(pairedScenario)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/40 text-xs font-medium transition-all shadow-sm shrink-0"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    Switch to {pairedScenario.type === 'async' ? 'Asynchronous' : 'Synchronous'}
                  </span>
                </button>
              )}
            </div>

            {/* Main Interactive Stage: Code Viewer on Left (or Right) + Engine Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Code Panel */}
              <div
                className={`lg:col-span-5 flex flex-col h-[520px] lg:h-[620px] ${
                  codePosition === 'right' ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <CodeViewer
                  lines={currentScenario.lines}
                  stepState={currentStepState}
                  title={`${currentScenario.id}.js`}
                  isAsync={currentScenario.type === 'async'}
                />
              </div>

              {/* Engine & Runtime Panel */}
              <div
                className={`lg:col-span-7 flex flex-col gap-4 h-[620px] ${
                  codePosition === 'right' ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                {/* Engine Architecture Visualizer */}
                <div className="flex-1 min-h-[360px]">
                  <EngineVisualizer stepState={currentStepState} />
                </div>

                {/* Console Output */}
                <div className="h-[210px]">
                  <ConsoleOutput logs={currentStepState.consoleLogs} />
                </div>
              </div>
            </div>

            {/* Playback & Step Controller */}
            <PlaybackControls
              currentStep={stepIndex}
              totalSteps={totalSteps}
              isPlaying={isPlaying}
              speed={speed}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onNext={handleNext}
              onPrev={handlePrev}
              onReset={handleReset}
              onSpeedChange={setSpeed}
              onStepSelect={setStepIndex}
            />

            {/* Deep-Dive Technical Explanation for Current Step */}
            <StepExplanation stepState={currentStepState} />
          </div>
        )}

        {/* Footer info & keyboard tips */}
        <footer className="mt-auto pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>JavaScript Concurrency Model</span>
            <span>•</span>
            <span>Event Loop & Task Queues</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
              Space
            </span>
            <span>Play/Pause</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 ml-1">
              &rarr;
            </span>
            <span>Step</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 ml-1">
              R
            </span>
            <span>Reset</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
