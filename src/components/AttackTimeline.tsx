import React from 'react';
import { 
  Clock, 
  ArrowDown, 
  AlertTriangle, 
  ShieldAlert, 
  Key, 
  Network, 
  FileUp, 
  ShieldCheck, 
  ChevronRight,
  Flame,
  Layers
} from 'lucide-react';
import { ThreatAlert } from '../types/cyber';

interface AttackTimelineProps {
  alerts: ThreatAlert[];
  onSelectAlert: (alert: ThreatAlert) => void;
}

export const AttackTimeline: React.FC<AttackTimelineProps> = ({ alerts, onSelectAlert }) => {
  // Filter for attack sequence threats (Port Scan, Brute Force, Lateral Movement, Data Exfiltration)
  const attackAlerts = alerts
    .filter((a) => a.threat !== 'Normal')
    .slice(0, 8); // show up to 8 recent attack steps

  // Check if we have multiple distinct correlated attack steps (e.g. at least 2 different high-risk threat types)
  const uniqueThreats = new Set(attackAlerts.map((a) => a.threat));
  const isCoordinatedSequence = uniqueThreats.size >= 2;

  const getThreatIcon = (threat: string) => {
    switch (threat) {
      case 'Port Scan':
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      case 'Brute Force':
        return <Key className="w-4 h-4 text-rose-400" />;
      case 'Lateral Movement':
        return <Network className="w-4 h-4 text-purple-400" />;
      case 'Data Exfiltration':
        return <FileUp className="w-4 h-4 text-red-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getRiskBorder = (score: number) => {
    if (score >= 90) return 'border-red-500/60';
    if (score >= 80) return 'border-rose-500/50';
    if (score >= 70) return 'border-amber-500/50';
    return 'border-slate-800';
  };

  return (
    <div className="glass-panel rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-mono uppercase text-slate-200 tracking-wider">
              Attack Story & Timeline
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
              CORRELATION ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Temporal reconstruction of multi-stage adversary tactics across internal subnets
          </p>
        </div>

        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
          <Clock className="w-4 h-4" />
        </div>
      </div>

      {/* Critical Attack Sequence Banner */}
      {isCoordinatedSequence && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 animate-in fade-in">
          <div className="flex items-center gap-2 text-rose-300 font-mono font-bold text-xs uppercase tracking-wide">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>CRITICAL ATTACK SEQUENCE DETECTED</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40">
              MITRE MULTI-STAGE
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            "Multiple suspicious events were observed from related activity and may represent a coordinated attack sequence."
          </p>
          <div className="mt-2 flex items-center gap-3 text-[11px] font-mono text-rose-400">
            <span>Reconnaissance &rarr; Credential Access &rarr; Lateral Movement &rarr; Exfiltration</span>
          </div>
        </div>
      )}

      {/* Timeline Steps Flow */}
      <div className="relative pl-6 space-y-4 my-2 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-amber-500 before:to-rose-500">
        {attackAlerts.length === 0 ? (
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-center text-xs font-mono text-slate-400">
            No active threat incidents currently in timeline. Trigger a scenario via Demo Attack Simulator above.
          </div>
        ) : (
          attackAlerts.map((alert, idx) => (
            <div key={alert.id} className="relative group">
              {/* Timeline dot / icon */}
              <div className="absolute -left-[30px] top-2.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              </div>

              {/* Card */}
              <div
                onClick={() => onSelectAlert(alert)}
                className={`p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border ${getRiskBorder(
                  alert.riskScore
                )} cursor-pointer transition-all duration-200 hover:translate-x-1`}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{alert.timestamp}</span>
                    <span className="text-slate-600">•</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-white text-xs">
                      {getThreatIcon(alert.threat)}
                      <span>{alert.threat}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Risk {alert.riskScore}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>

                <div className="text-xs font-mono text-cyan-300 flex items-center gap-2 mt-1">
                  <span>{alert.sourceIp}</span>
                  <span className="text-slate-600">&rarr;</span>
                  <span>{alert.destinationIp}</span>
                </div>

                <div className="mt-2 text-[11px] text-slate-400 line-clamp-1">
                  {alert.evidence[0]}
                </div>
              </div>

              {/* Flow connector arrow if not last */}
              {idx < attackAlerts.length - 1 && (
                <div className="flex justify-center my-1 text-slate-600">
                  <ArrowDown className="w-3.5 h-3.5 text-cyan-500/60" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Temporal Clustering: Active (300s window)</span>
        <span className="text-cyan-400">Graph Correlation Active</span>
      </div>
    </div>
  );
};
