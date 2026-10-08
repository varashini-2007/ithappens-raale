import React, { useState } from 'react';
import { NetworkConnectionFlow } from '../types/cyber';
import { Network, ArrowRight, ShieldAlert, Key, FileUp, ShieldCheck, Activity, Globe, Server, Laptop } from 'lucide-react';

interface NetworkActivityViewProps {
  flows: NetworkConnectionFlow[];
}

export const NetworkActivityView: React.FC<NetworkActivityViewProps> = ({ flows }) => {
  const [filterActiveOnly, setFilterActiveOnly] = useState(false);

  const displayFlows = filterActiveOnly ? flows.filter(f => f.active) : flows;

  const getThreatBadge = (threat: string) => {
    switch (threat) {
      case 'Port Scan':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Brute Force':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'Lateral Movement':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'Data Exfiltration':
        return 'text-red-400 bg-red-600/15 border-red-500/40';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="glass-panel rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-mono uppercase text-slate-200 tracking-wider">
              Network Telemetry Activity Flows
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/50">
              SOCKET GRAPH
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Active Layer 4/7 bidirectional conversations mapped across internal VLANs and external C2 egress
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={filterActiveOnly}
              onChange={(e) => setFilterActiveOnly(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Active Sockets Only</span>
          </label>
        </div>
      </div>

      {/* Network Connection Flows List */}
      <div className="space-y-2.5">
        {displayFlows.map((flow) => {
          const isDanger = flow.riskScore > 70;
          const isExternal = flow.destinationIp.startsWith('45.') || flow.destinationIp.includes('cdn');
          return (
            <div
              key={flow.id}
              className={`p-3 rounded-xl border transition-all duration-200 ${
                isDanger
                  ? 'bg-rose-950/15 hover:bg-rose-950/25 border-rose-500/40 shadow-sm'
                  : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Node Connection Line */}
                <div className="flex items-center gap-3 font-mono text-xs flex-wrap">
                  {/* Source Node */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                    <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-cyan-300 font-bold">{flow.sourceIp}</span>
                  </div>

                  {/* Flow arrow with pulse */}
                  <div className="flex items-center gap-1 text-slate-500">
                    <span className="h-0.5 w-4 bg-cyan-500/40"></span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="h-0.5 w-4 bg-cyan-500/40"></span>
                  </div>

                  {/* Destination Node */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                    {isExternal ? (
                      <Globe className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <Server className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span className={`font-bold ${isExternal ? 'text-rose-400' : 'text-amber-300'}`}>
                      {flow.destinationIp}
                    </span>
                  </div>

                  {/* Protocol & Port */}
                  <span className="px-2 py-0.5 rounded text-[11px] bg-slate-850 text-slate-300 border border-slate-750">
                    {flow.protocol}
                  </span>
                </div>

                {/* Right: Bytes transferred, Threat & Risk */}
                <div className="flex items-center gap-3 font-mono text-xs">
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">PAYLOAD</span>
                    <span className="text-slate-200 font-semibold">{flow.bytes}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getThreatBadge(flow.threat)}`}>
                    {flow.threat}
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[11px] border ${
                    isDanger ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold' : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}>
                    Risk {flow.riskScore}
                  </span>

                  <div className="flex items-center gap-1">
                    <span className={`h-2 w-2 rounded-full ${flow.active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
                    <span className="text-[10px] text-slate-500">{flow.active ? 'LIVE' : 'IDLE'}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Network Tap: TAP-01 / Core-Switch-Mirror</span>
        <span className="text-cyan-400">Zero Packet Drop</span>
      </div>
    </div>
  );
};
