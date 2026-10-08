import React, { useState, useMemo } from 'react';
import { ThreatAlert } from '../types/cyber';
import { 
  Search, 
  Filter, 
  Download, 
  ShieldAlert, 
  Key, 
  Network, 
  FileUp, 
  ShieldCheck, 
  Eye, 
  CheckCircle2, 
  Clock,
  ArrowUpDown
} from 'lucide-react';

interface AlertHistoryViewProps {
  alerts: ThreatAlert[];
  onInspectAlert: (alert: ThreatAlert) => void;
}

type FilterCategory = 
  | 'All' 
  | 'Critical' 
  | 'Suspicious' 
  | 'Normal' 
  | 'Port Scan' 
  | 'Brute Force' 
  | 'Lateral Movement' 
  | 'Data Exfiltration';

export const AlertHistoryView: React.FC<AlertHistoryViewProps> = ({ alerts, onInspectAlert }) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const [searchIp, setSearchIp] = useState<string>('');

  const filterButtons: FilterCategory[] = [
    'All',
    'Critical',
    'Suspicious',
    'Normal',
    'Port Scan',
    'Brute Force',
    'Lateral Movement',
    'Data Exfiltration',
  ];

  // Filter and search logic
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      // 1. IP search filter
      if (searchIp.trim()) {
        const query = searchIp.toLowerCase().trim();
        const matchesSource = alert.sourceIp.toLowerCase().includes(query);
        const matchesDest = alert.destinationIp.toLowerCase().includes(query);
        const matchesId = alert.id.toLowerCase().includes(query);
        if (!matchesSource && !matchesDest && !matchesId) return false;
      }

      // 2. Category filter
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Critical') return alert.riskScore >= 71;
      if (activeFilter === 'Suspicious') return alert.riskScore > 30 && alert.riskScore <= 70;
      if (activeFilter === 'Normal') return alert.riskScore <= 30;
      return alert.threat === activeFilter;
    });
  }, [alerts, activeFilter, searchIp]);

  // Export to CSV
  const handleExportCsv = () => {
    const headerStr = 'Alert ID,Timestamp,Source IP,Destination IP,Threat,Risk Score,Confidence,Status,Protocol,Connections,Failed Logins,Bytes Transferred\n';
    const rows = filteredAlerts.map(a => 
      `"${a.id}","${a.timestamp}","${a.sourceIp}","${a.destinationIp}","${a.threat}",${a.riskScore},"${a.confidence}%","${a.status}","${a.telemetry.protocol}",${a.telemetry.connections},${a.telemetry.failedLogins},"${a.telemetry.bytesFormatted}"`
    );
    const csvContent = headerStr + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cybersentinel-alerts-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-mono uppercase text-slate-200 tracking-wider">
              Alert History & Incident Log
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/50">
              AUDIT TRAIL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable log of telemetry detections, risk assessments, and SecOps dispositions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {filterButtons.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors border ${
                activeFilter === cat
                  ? 'bg-slate-800 text-cyan-300 border-cyan-500/40 font-semibold'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* IP Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-alert-search"
            type="text"
            placeholder="Search by IP (e.g. 192.168.1.10)..."
            value={searchIp}
            onChange={(e) => setSearchIp(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
          />
          {searchIp && (
            <button
              onClick={() => setSearchIp('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-mono"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800/80">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3">Alert ID</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Source IP</th>
              <th className="py-2.5 px-3">Destination IP</th>
              <th className="py-2.5 px-3">Threat</th>
              <th className="py-2.5 px-3">Risk</th>
              <th className="py-2.5 px-3">Confidence</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850/60 bg-[#090f1d]/40">
            {filteredAlerts.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500">
                  No alerts match your filter criteria or search keyword.
                </td>
              </tr>
            ) : (
              filteredAlerts.map((alert) => {
                const threatInfo = getThreatBadge(alert.threat);
                return (
                  <tr
                    key={alert.id}
                    onClick={() => onInspectAlert(alert)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-3 text-cyan-400 font-bold whitespace-nowrap">
                      {alert.id}
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {alert.timestamp}
                    </td>
                    <td className="py-3 px-3 text-white font-medium whitespace-nowrap">
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
                        className="px-2.5 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-300 hover:text-white text-[11px] inline-flex items-center gap-1 transition-all"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Audit</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Showing {filteredAlerts.length} filtered incidents</span>
        <span className="text-slate-500">Persisted locally in Browser Storage</span>
      </div>
    </div>
  );
};
