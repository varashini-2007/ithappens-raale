import React from 'react';
import { ThreatType, ThreatAlert } from '../types/cyber';
import { PieChart, ShieldAlert } from 'lucide-react';

interface ThreatDistributionProps {
  alerts: ThreatAlert[];
}

interface ThreatStat {
  type: ThreatType;
  count: number;
  percentage: number;
  color: string;
  badgeBg: string;
}

export const ThreatDistribution: React.FC<ThreatDistributionProps> = ({ alerts }) => {
  // Compute counts for all 5 threat categories
  const threatConfig: Record<ThreatType, { color: string; badgeBg: string }> = {
    'Normal': { color: '#10b981', badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    'Port Scan': { color: '#f59e0b', badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    'Brute Force': { color: '#f43f5e', badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    'Lateral Movement': { color: '#a855f7', badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    'Data Exfiltration': { color: '#ef4444', badgeBg: 'bg-red-600/15 text-red-400 border-red-500/40' },
  };

  const total = alerts.length || 1;
  const counts: Record<ThreatType, number> = {
    'Normal': 0,
    'Port Scan': 0,
    'Brute Force': 0,
    'Lateral Movement': 0,
    'Data Exfiltration': 0,
  };

  alerts.forEach((alert) => {
    if (counts[alert.threat] !== undefined) {
      counts[alert.threat]++;
    }
  });

  const stats: ThreatStat[] = (Object.keys(counts) as ThreatType[]).map((threat) => ({
    type: threat,
    count: counts[threat],
    percentage: Math.round((counts[threat] / total) * 100),
    color: threatConfig[threat].color,
    badgeBg: threatConfig[threat].badgeBg,
  }));

  // Calculate donut segments
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <div className="glass-panel rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-mono uppercase text-slate-200 tracking-wider">
              Threat Distribution
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/50">
              5 CLASSES
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Breakdown of classified network events across threat vectors
          </p>
        </div>

        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
          <PieChart className="w-4 h-4" />
        </div>
      </div>

      {/* Content: SVG Donut + Legend List */}
      <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
        {/* SVG Donut */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
            {/* Background ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="rgba(30, 41, 59, 0.5)"
              strokeWidth="20"
              fill="transparent"
            />
            {/* Render segments */}
            {stats.map((stat, i) => {
              const strokeDasharray = `${(stat.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += stat.percentage;

              if (stat.percentage === 0) return null;

              return (
                <circle
                  key={stat.type}
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={stat.color}
                  strokeWidth="20"
                  fill="transparent"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 ease-out"
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold font-mono text-white">{alerts.length}</span>
            <span className="text-[10px] font-mono uppercase text-slate-400">Total Alerts</span>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="flex-1 w-full space-y-2">
          {stats.map((stat) => (
            <div key={stat.type} className="group">
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: stat.color }}
                  ></span>
                  <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                    {stat.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{stat.count}</span>
                  <span className="text-slate-500 text-[11px] w-8 text-right">{stat.percentage}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.max(stat.percentage, stat.count > 0 ? 5 : 0)}%`,
                    backgroundColor: stat.color,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/70 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Classifier Model: Random Forest Ensemble</span>
        <span className="text-emerald-400">Accuracy 96.4%</span>
      </div>
    </div>
  );
};
