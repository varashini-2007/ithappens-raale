import React from 'react';
import { Shield, ShieldAlert, AlertOctagon, CheckCircle2, ChevronRight, Activity, Zap } from 'lucide-react';
import { ThreatAlert } from '../types/cyber';

interface ThreatRiskOverviewProps {
  highestRisk: number;
  latestAlert: ThreatAlert | null;
  onInspectAlert: (alert: ThreatAlert) => void;
}

export const ThreatRiskOverview: React.FC<ThreatRiskOverviewProps> = ({
  highestRisk,
  latestAlert,
  onInspectAlert,
}) => {
  // Determine risk band
  const getRiskBandDetails = (score: number) => {
    if (score <= 30) {
      return {
        band: 'NORMAL',
        color: '#10b981',
        textClass: 'text-emerald-400',
        bgClass: 'bg-emerald-500/10',
        borderClass: 'border-emerald-500/30',
        shadowClass: '',
        description: 'Network traffic within standard baseline tolerances. No immediate intervention required.',
      };
    } else if (score <= 70) {
      return {
        band: 'SUSPICIOUS',
        color: '#f59e0b',
        textClass: 'text-amber-400',
        bgClass: 'bg-amber-500/10',
        borderClass: 'border-amber-500/30',
        shadowClass: '',
        description: 'Anomalous telemetry detected. Host behavioral pattern warrants targeted monitoring.',
      };
    } else {
      return {
        band: 'MALICIOUS',
        color: '#ef4444',
        textClass: 'text-rose-400',
        bgClass: 'bg-rose-500/15',
        borderClass: 'border-rose-500/40',
        shadowClass: '',
        description: 'High-severity adversary activity detected with verified feature evidence. Immediate action recommended.',
      };
    }
  };

  const riskDetails = getRiskBandDetails(highestRisk);

  // Radial arc math for 0 to 100
  // Semicircle / 240 degree gauge
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  // Use a 240 degree arc (about 66.6% of full circumference)
  const arcLength = circumference * 0.72;
  const strokeDashoffset = arcLength - (arcLength * Math.min(Math.max(highestRisk, 0), 100)) / 100;

  return (
    <div className="glass-panel rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
      {/* Background radial glow */}
      <div 
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none opacity-25 blur-3xl"
        style={{ backgroundColor: riskDetails.color }}
      ></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-mono uppercase text-slate-200 tracking-wider">
              Threat Risk Overview
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/50">
              0 - 100 SCORE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time composite risk evaluated by Random Forest & Behavioral Engine
          </p>
        </div>

        <div className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase border ${riskDetails.bgClass} ${riskDetails.textClass} ${riskDetails.borderClass}`}>
          {riskDetails.band}
        </div>
      </div>

      {/* Central Visual Gauge */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
        {/* SVG Circular Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-48 h-48 transform -rotate-125" viewBox="0 0 200 200">
            {/* Background track */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="rgba(30, 41, 59, 0.6)"
              strokeWidth="14"
              fill="transparent"
              strokeDasharray={arcLength}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            {/* Value track */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke={riskDetails.color}
              strokeWidth="14"
              fill="transparent"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              style={{
                filter: `drop-shadow(0 0 10px ${riskDetails.color}80)`,
              }}
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold font-mono tracking-tight text-white drop-shadow">
              {highestRisk}
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">
              MAX RISK
            </span>
            <span className={`text-[10px] font-mono font-bold mt-1 px-1.5 py-0.5 rounded ${riskDetails.bgClass} ${riskDetails.textClass}`}>
              {riskDetails.band}
            </span>
          </div>
        </div>

        {/* Risk Bands Breakdown and Legend */}
        <div className="flex-1 w-full max-w-xs space-y-2.5">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between pb-1 border-b border-slate-800">
            <span>RISK CLASSIFICATION BANDS</span>
            <span className="text-slate-500">SEVERITY</span>
          </div>

          {/* Band 1: Normal 0-30 */}
          <div className={`p-2 rounded-lg border text-xs font-mono flex items-center justify-between transition-all ${
            highestRisk <= 30
              ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-sm'
              : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
          }`}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="font-semibold">0 - 30</span>
              <span>NORMAL</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">Low Risk</span>
          </div>

          {/* Band 2: Suspicious 31-70 */}
          <div className={`p-2 rounded-lg border text-xs font-mono flex items-center justify-between transition-all ${
            highestRisk > 30 && highestRisk <= 70
              ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-sm'
              : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
          }`}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span>
              <span className="font-semibold">31 - 70</span>
              <span>SUSPICIOUS</span>
            </div>
            <span className="text-[11px] text-amber-400 font-medium">Elevated</span>
          </div>

          {/* Band 3: Malicious 71-100 */}
          <div className={`p-2 rounded-lg border text-xs font-mono flex items-center justify-between transition-colors ${
            highestRisk > 70
              ? 'bg-rose-950/40 border-rose-500/60 text-rose-300'
              : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
          }`}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-400"></span>
              <span className="font-semibold">71 - 100</span>
              <span>MALICIOUS</span>
            </div>
            <span className="text-[11px] text-rose-400 font-semibold">Critical P1</span>
          </div>
        </div>
      </div>

      {/* Highest Active Threat footer */}
      {latestAlert && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">Highest Threat:</span>
            <span className="font-bold text-white font-mono">{latestAlert.threat}</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-mono">{latestAlert.sourceIp} &rarr; {latestAlert.destinationIp}</span>
          </div>

          <button
            onClick={() => onInspectAlert(latestAlert)}
            className="flex items-center gap-1 text-xs font-mono text-cyan-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded border border-slate-800 hover:border-cyan-500/40 transition-colors"
          >
            <span>Explain Alert</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
