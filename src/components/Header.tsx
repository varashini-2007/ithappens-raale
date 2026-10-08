import React, { useState, useEffect } from 'react';
import { Shield, Activity, Radio, Cpu, Bell, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { SystemMetrics, PolicyConfig } from '../types/cyber';

interface HeaderProps {
  metrics: SystemMetrics;
  policy: PolicyConfig;
  highestRisk: number;
  onOpenDemoGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  metrics,
  policy,
  highestRisk,
  onOpenDemoGuide,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const isBreached = highestRisk > policy.maxAllowedRisk;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-800/80 bg-[#070d18]/90 backdrop-blur-md sticky top-0 z-30">
      {/* Top Banner Status Bar */}
      <div className="bg-[#050811] px-4 py-1.5 border-b border-slate-800/60 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-400 font-mono">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>SYSTEM MONITORING</span>
          </div>

          <span className="text-slate-700">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Telemetry Engine:</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              ONLINE
            </span>
          </div>

          <span className="text-slate-700">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">AI Detection:</span>
            <span className="text-cyan-300 font-medium flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" />
              ACTIVE
            </span>
          </div>

          <span className="text-slate-700">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Policy Guard:</span>
            {isBreached ? (
              <span className="text-rose-400 font-bold flex items-center gap-1 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/50">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                BREACH (Max {policy.maxAllowedRisk} vs {highestRisk})
              </span>
            ) : (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ENFORCED (Max {policy.maxAllowedRisk})
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Radio className="w-3 h-3 text-cyan-400" />
            <span className="text-cyan-400">SOC CLOCK:</span>
            <span className="text-slate-200">{currentTime || '12:00:00'} UTC</span>
          </div>
          <button
            onClick={onOpenDemoGuide}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 hover:text-white text-[11px] font-mono transition-colors"
            title="Open Judge 2-Minute Demo Flow Guide"
          >
            <HelpCircle className="w-3 h-3 text-cyan-400" />
            <span>Judge Demo Guide</span>
          </button>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
            <Shield className="w-5 h-5 text-cyan-400" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#070d18]"></div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-wider font-mono text-white flex items-center gap-2">
                CYBERSENTINEL <span className="text-cyan-400">AI</span>
              </h1>
              <span className="text-[10px] tracking-widest font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                TIER-3 SOC
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="font-semibold text-slate-300">"Detect. Explain. Score. Act."</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 hidden sm:inline">
                Explainable Real-Time Cyber Threat Detection & Risk Intelligence
              </span>
            </p>
          </div>
        </div>

        {/* Status Callout Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>REAL-TIME MONITORING ACTIVE</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>TELEMETRY RATE:</span>
            <span className="text-cyan-300 font-semibold">180 conn/s</span>
          </div>
        </div>
      </div>
    </header>
  );
};
