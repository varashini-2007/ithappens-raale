import React from 'react';
import { Filter, CheckCircle2, ShieldCheck, Layers } from 'lucide-react';
import { FILTERED_NOISE_PROTOCOLS } from '../data/mockData';

interface NoiseControlCardProps {
  totalFiltered: number;
}

export const NoiseControlCard: React.FC<NoiseControlCardProps> = ({ totalFiltered }) => {
  return (
    <div className="glass-panel rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-mono uppercase text-slate-200 tracking-wider">
              NOISE CONTROL & FILTERING
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
              ALERT FATIGUE SUPPRESSION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automatic background suppression isolating non-threatening operational telemetry
          </p>
        </div>

        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
          <Filter className="w-4 h-4" />
        </div>
      </div>

      {/* Main Quote / Message */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono mb-4">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-slate-300 italic leading-relaxed">
            "Known benign/background activity is de-prioritized to reduce alert fatigue."
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-cyan-900/40 flex items-center justify-between text-[11px] text-cyan-300">
          <span>Suppressed Packets: <strong>{totalFiltered.toLocaleString()}</strong></span>
          <span>Noise Reduction Rate: <strong>98.4%</strong></span>
        </div>
      </div>

      {/* Filtered Protocols Table / Grid */}
      <div className="space-y-2 text-xs font-mono">
        <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">
          FILTERED BACKGROUND EVENT TYPES:
        </span>
        {FILTERED_NOISE_PROTOCOLS.map((item) => (
          <div
            key={item.protocol}
            className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold text-[11px]">
                {item.protocol}
              </span>
              <span className="text-slate-300 text-xs">{item.description}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">{item.count.toLocaleString()} pkts</span>
              <span className="text-cyan-400 text-[11px] font-semibold">{item.percent}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Whitelisted Protocols: RFC-Compliant Baselines</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Clean Signal
        </span>
      </div>
    </div>
  );
};
