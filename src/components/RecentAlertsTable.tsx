import React from 'react';
import { ThreatAlert } from '../types/cyber';
import { ShieldAlert, Key, Network, FileUp, ShieldCheck, Eye, ArrowUpRight, Search } from 'lucide-react';

interface RecentAlertsTableProps {
  alerts: ThreatAlert[];
  onInspectAlert: (alert: ThreatAlert) => void;
  maxRows?: number;
}

export const RecentAlertsTable: React.FC<RecentAlertsTableProps> = ({
  alerts,
  onInspectAlert,
  maxRows = 6,
}) => {
  const displayAlerts = alerts.slice(0, maxRows);

  const getThreatBadge = (threat: string) => {
    switch (threat) {
      case 'Port Scan':
        return {
          icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />,
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };
      case 'Brute Force':
        return {
          icon: <Key className="w-3.5 h-3.5 text-rose-400" />,
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        };
      case 'Lateral Movement':
        return {
          icon: <Network className="w-3.5 h-3.5 text-purple-400" />,
          badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        };
      case 'Data Exfiltration':
        return {
          icon: <FileUp className="w-3.5 h-3.5 text-red-400" />,
          badge: 'bg-red-600/15 text-red-400 border-red-500/40',
        };
      default:
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score <= 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/20 border-rose-500/40 font-bold';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'INVESTIGATING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'BLOCKED':
        return 'bg-red-600/20 text-red-300 border-red-500/40';
      case 'RESOLVED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="glass-panel rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-mono uppercase text-slate-200 tracking-wider">
              Recent Threat Alerts
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/50">
              REAL-TIME TRIAGE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any row to reveal explainable feature evidence, SHAP weights, and MITRE mapping
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing <span className="text-cyan-300 font-bold">{displayAlerts.length}</span> of {alerts.length} events
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Source IP</th>
              <th className="py-2.5 px-3">Destination IP</th>
              <th className="py-2.5 px-3">Threat</th>
              <th className="py-2.5 px-3">Risk</th>
              <th className="py-2.5 px-3">Confidence</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Evidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850/60">
            {displayAlerts.map((alert) => {
              const threatInfo = getThreatBadge(alert.threat);
              return (
                <tr
                  key={alert.id}
                  onClick={() => onInspectAlert(alert)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                    {alert.timestamp}
                  </td>
                  <td className="py-3 px-3 text-cyan-300 font-semibold whitespace-nowrap">
                    {alert.sourceIp}
                  </td>
                  <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                    {alert.destinationIp}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-medium ${threatInfo.badge}`}>
                      {threatInfo.icon}
                      {alert.threat}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded border text-[11px] font-mono ${getRiskColor(alert.riskScore)}`}>
                      {alert.riskScore}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                    {alert.confidence}%
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${getStatusBadge(alert.status)}`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectAlert(alert);
                      }}
                      className="px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 hover:text-white text-[11px] inline-flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3 h-3 text-cyan-400" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
