import React from 'react';
import { 
  Activity, 
  ShieldAlert, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SystemMetrics } from '../types/cyber';

interface MetricCardsProps {
  metrics: SystemMetrics;
  highestRisk: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics, highestRisk }) => {
  // Determine risk level color & label for average risk
  const getRiskBadge = (score: number) => {
    if (score <= 30) {
      return {
        label: 'NORMAL',
        bgColor: 'bg-emerald-500/10',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
      };
    } else if (score <= 70) {
      return {
        label: 'SUSPICIOUS',
        bgColor: 'bg-amber-500/10',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/30',
      };
    } else {
      return {
        label: 'MALICIOUS',
        bgColor: 'bg-rose-500/15',
        textColor: 'text-rose-400',
        borderColor: 'border-rose-500/40',
      };
    }
  };

  const avgRiskBadge = getRiskBadge(metrics.averageRiskScore);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Total Events */}
      <div className="glass-panel rounded-xl p-4 relative overflow-hidden transition-all duration-200 hover:translate-y-[-2px]">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Events</span>
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold font-mono text-white tracking-tight">
            {metrics.totalEvents.toLocaleString()}
          </span>
          <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-0.5">
            <Zap className="w-3 h-3" />
            +180/sec
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2">
          <span>Packets Ingested</span>
          <span className="text-slate-300">NetFlow / IPFIX</span>
        </div>
      </div>

      {/* Metric 2: Active Threats */}
      <div className={`glass-panel rounded-xl p-4 relative overflow-hidden transition-all duration-200 hover:translate-y-[-2px] ${
        metrics.activeThreats > 0 ? 'border-amber-500/30' : ''
      }`}>
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Active Threats</span>
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold font-mono text-amber-300 tracking-tight">
            {metrics.activeThreats}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
            {metrics.activeThreats > 0 ? 'INVESTIGATING' : 'CLEAR'}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2">
          <span>Classified by RF & IF</span>
          <span className="text-amber-400">Triaged</span>
        </div>
      </div>

      {/* Metric 3: Critical Alerts */}
      <div className={`glass-panel rounded-xl p-4 relative overflow-hidden transition-colors ${
        metrics.criticalAlerts > 0 ? 'border-rose-500/40' : ''
      }`}>
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Critical Alerts</span>
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-mono text-rose-400 tracking-tight">
              {metrics.criticalAlerts}
            </span>
            {metrics.criticalAlerts > 0 && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
            Risk &ge; 71
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2">
          <span>Priority P1 SecOps</span>
          <span className="text-rose-400 font-semibold">Immediate Action</span>
        </div>
      </div>

      {/* Metric 4: Average Risk Score */}
      <div className="glass-panel rounded-xl p-4 relative overflow-hidden transition-all duration-200 hover:translate-y-[-2px]">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Average Risk Score</span>
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">
              {metrics.averageRiskScore}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
          </div>
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${avgRiskBadge.bgColor} ${avgRiskBadge.textColor} ${avgRiskBadge.borderColor}`}>
            {avgRiskBadge.label}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2">
          <span>Peak Session Risk</span>
          <span className="text-cyan-300 font-semibold">{highestRisk} / 100</span>
        </div>
      </div>
    </div>
  );
};
