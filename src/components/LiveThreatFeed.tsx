import React, { useState, useEffect } from 'react';
import { ThreatAlert } from '../types/cyber';
import { 
  Radio, 
  Play, 
  Pause, 
  RefreshCw, 
  ShieldAlert, 
  Key, 
  Network, 
  FileUp, 
  ShieldCheck, 
  Eye, 
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';

interface LiveThreatFeedProps {
  alerts: ThreatAlert[];
  onInspectAlert: (alert: ThreatAlert) => void;
  onInjectBenignPacket?: () => void;
}

export const LiveThreatFeed: React.FC<LiveThreatFeedProps> = ({
  alerts,
  onInspectAlert,
  onInjectBenignPacket,
}) => {
  const [isStreaming, setIsStreaming] = useState(true);
  const [streamSpeed, setStreamSpeed] = useState<'normal' | 'fast'>('normal');

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

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score <= 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/20 border-rose-500/40 font-bold';
  };

  return (
    <div className="glass-panel rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isStreaming && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isStreaming ? 'bg-cyan-400' : 'bg-slate-500'}`}></span>
            </span>
            <h3 className="text-sm font-bold font-mono uppercase text-slate-200 tracking-wider">
              Live Threat Telemetry Feed
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/50">
            {isStreaming ? 'STREAMING' : 'PAUSED'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 transition-colors"
          >
            {isStreaming ? (
              <>
                <Pause className="w-3 h-3 text-amber-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-emerald-400" />
                <span>Resume</span>
              </>
            )}
          </button>

          {onInjectBenignPacket && (
            <button
              onClick={onInjectBenignPacket}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 transition-colors"
              title="Inject a deterministic benign background telemetry sample"
            >
              <RefreshCw className="w-3 h-3 text-cyan-400" />
              <span>+ Sample</span>
            </button>
          )}
        </div>
      </div>

      {/* Feed list */}
      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
        {alerts.map((item, index) => {
          const isHighThreat = item.riskScore > 70;
          return (
            <div
              key={item.id + '-' + index}
              onClick={() => onInspectAlert(item)}
              className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer hover:translate-x-1 ${
                isHighThreat
                  ? 'bg-rose-950/20 hover:bg-rose-950/30 border-rose-500/40 shadow-sm'
                  : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800/80'
              }`}
            >
              {/* Row 1: Status, timestamp, threat & risk */}
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-400">{item.timestamp}</span>
                  <span className="text-slate-600">•</span>
                  <div className="flex items-center gap-1 font-bold text-white">
                    {getThreatIcon(item.threat)}
                    <span>{item.threat}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono border ${getRiskColor(item.riskScore)}`}>
                    Risk {item.riskScore}
                  </span>
                  <span className="text-slate-400 font-mono text-xs">
                    {item.confidence}% conf
                  </span>
                </div>
              </div>

              {/* Row 2: Source IP & Dest IP */}
              <div className="flex items-center justify-between font-mono text-xs text-slate-300 mb-2.5 bg-slate-950/60 p-2 rounded-lg border border-slate-850">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-[10px]">SRC:</span>
                  <span className="text-cyan-300 font-bold">{item.sourceIp}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-600" />
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-[10px]">DST:</span>
                  <span className="text-amber-300 font-bold">{item.destinationIp}</span>
                </div>
              </div>

              {/* Row 3: Full 8 Telemetry Parameters as required */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/40 p-2 rounded-lg border border-slate-850">
                <div>
                  <span className="text-slate-500 block text-[10px]">PROTOCOL</span>
                  <span className="text-slate-200 font-medium">{item.telemetry.protocol}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">CONNECTIONS</span>
                  <span className="text-slate-200 font-medium">{item.telemetry.connections} conns</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">UNIQUE PORTS</span>
                  <span className="text-slate-200 font-medium">{item.telemetry.uniquePorts} ports</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">FAILED LOGINS</span>
                  <span className={`font-medium ${item.telemetry.failedLogins > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {item.telemetry.failedLogins}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">BYTES TRANSFERRED</span>
                  <span className="text-slate-200 font-medium">{item.telemetry.bytesFormatted}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">WINDOW</span>
                  <span className="text-slate-200 font-medium">{item.telemetry.timeWindowSec}s</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">DEST DIVERSITY</span>
                  <span className="text-slate-200 font-medium">{item.telemetry.destinationDiversity}</span>
                </div>
                <div className="flex items-end justify-end">
                  <span className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold text-[11px]">
                    <Eye className="w-3 h-3" />
                    Explain &rarr;
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Deterministic Demo Telemetry Engine</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Ingestion Synced
        </span>
      </div>
    </div>
  );
};
