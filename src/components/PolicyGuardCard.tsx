import React from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  CheckCircle2, 
  SlidersHorizontal,
  Zap,
  Ban
} from 'lucide-react';
import { PolicyConfig } from '../types/cyber';

interface PolicyGuardCardProps {
  policy: PolicyConfig;
  onUpdatePolicy: (newPolicy: PolicyConfig) => void;
  currentHighestRisk: number;
  onAutoBlockAllBreaches?: () => void;
}

export const PolicyGuardCard: React.FC<PolicyGuardCardProps> = ({
  policy,
  onUpdatePolicy,
  currentHighestRisk,
  onAutoBlockAllBreaches,
}) => {
  const isBreached = currentHighestRisk > policy.maxAllowedRisk;
  const riskDelta = currentHighestRisk - policy.maxAllowedRisk;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdatePolicy({
      ...policy,
      maxAllowedRisk: Number(e.target.value),
    });
  };

  const setPreset = (val: number) => {
    onUpdatePolicy({
      ...policy,
      maxAllowedRisk: val,
    });
  };

  return (
    <div className={`glass-panel rounded-xl p-5 relative overflow-hidden transition-colors ${
      isBreached ? 'border-rose-500/60' : 'border-slate-800'
    }`}>
      {/* Subtle indicator accent */}
      {isBreached && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-rose-500"></div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-mono uppercase text-slate-200 tracking-wider">
              POLICY GUARD
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
              ZERO-TRUST GOVERNANCE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Dynamic risk threshold enforcement controlling automated quarantine actions
          </p>
        </div>

        <div className={`p-2 rounded-lg border ${
          isBreached ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          {isBreached ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <ShieldCheck className="w-4 h-4" />}
        </div>
      </div>

      {/* Main Breach Banner */}
      <div className={`p-4 rounded-xl border mb-5 transition-colors ${
        isBreached 
          ? 'bg-rose-950/40 border-rose-500/60 text-rose-200' 
          : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-wider">
            {isBreached ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <span className="text-rose-300">🚨 POLICY STATUS: BREACH DETECTED</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">POLICY STATUS: ALLOWED / MONITOR</span>
              </>
            )}
          </div>

          <div className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded bg-black/40 border border-white/10">
            {isBreached ? `+${riskDelta} pts over threshold` : 'Compliant'}
          </div>
        </div>

        {/* Dynamic Details */}
        <div className="mt-3 flex items-baseline justify-between font-mono text-xs">
          <div>
            <span className="text-slate-400">Maximum Allowed Risk: </span>
            <span className="font-bold text-white text-sm">{policy.maxAllowedRisk}</span>
          </div>
          <div>
            <span className="text-slate-400">Current Risk: </span>
            <span className={`font-bold text-sm ${isBreached ? 'text-rose-400' : 'text-emerald-400'}`}>
              {currentHighestRisk}
            </span>
          </div>
        </div>

        {/* Action Recommendation */}
        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300">RECOMMENDED ACTION:</span>
          <span className={`font-bold ${isBreached ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isBreached ? 'BLOCK / INVESTIGATE' : 'MONITOR / ALLOW'}
          </span>
        </div>
      </div>

      {/* Slider Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            MAXIMUM ALLOWED RISK THRESHOLD
          </span>
          <span className="text-cyan-300 font-bold text-sm bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
            {policy.maxAllowedRisk} / 100
          </span>
        </div>

        {/* Custom Range Slider */}
        <div className="relative">
          <input
            id="policy-risk-slider"
            type="range"
            min="10"
            max="100"
            step="5"
            value={policy.maxAllowedRisk}
            onChange={handleSliderChange}
            className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-700 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>10 (Ultra Strict)</span>
            <span>50 (Strict)</span>
            <span className="text-cyan-400 font-bold">70 (Default)</span>
            <span>90 (Permissive)</span>
            <span>100</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-slate-400">Presets:</span>
          <button
            onClick={() => setPreset(50)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
              policy.maxAllowedRisk === 50
                ? 'bg-slate-800 text-cyan-300 border-cyan-500/40 font-semibold'
                : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
          >
            Strict (50)
          </button>
          <button
            onClick={() => setPreset(70)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
              policy.maxAllowedRisk === 70
                ? 'bg-slate-800 text-cyan-300 border-cyan-500/40 font-semibold'
                : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
          >
            Default (70)
          </button>
          <button
            onClick={() => setPreset(85)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
              policy.maxAllowedRisk === 85
                ? 'bg-slate-800 text-cyan-300 border-cyan-500/40 font-semibold'
                : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
          >
            Permissive (85)
          </button>
        </div>
      </div>

      {/* Auto-Block Option */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={policy.autoBlockBreaches}
            onChange={(e) => onUpdatePolicy({ ...policy, autoBlockBreaches: e.target.checked })}
            className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
          />
          <span>Auto-Quarantine Hosts on Breach</span>
        </label>

        {isBreached && onAutoBlockAllBreaches && (
          <button
            onClick={onAutoBlockAllBreaches}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-mono font-medium transition-colors"
          >
            <Ban className="w-3 h-3" />
            <span>Enforce Block</span>
          </button>
        )}
      </div>
    </div>
  );
};
