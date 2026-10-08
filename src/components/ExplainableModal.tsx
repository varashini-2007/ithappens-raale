import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Terminal, 
  ExternalLink, 
  Lock, 
  Ban, 
  Download, 
  Check, 
  Copy,
  Cpu,
  Layers,
  Activity,
  ArrowRight
} from 'lucide-react';
import { ThreatAlert } from '../types/cyber';

interface ExplainableModalProps {
  alert: ThreatAlert | null;
  onClose: () => void;
  onBlockIp: (ip: string) => void;
  onIsolateHost: (ip: string) => void;
  blockedIps: Set<string>;
  isolatedHosts: Set<string>;
}

export const ExplainableModal: React.FC<ExplainableModalProps> = ({
  alert,
  onClose,
  onBlockIp,
  onIsolateHost,
  blockedIps,
  isolatedHosts,
}) => {
  const [copiedJson, setCopiedJson] = useState(false);

  if (!alert) return null;

  const isBlocked = blockedIps.has(alert.sourceIp);
  const isIsolated = isolatedHosts.has(alert.destinationIp);

  // Risk styling
  const getRiskStyle = (score: number) => {
    if (score <= 30) {
      return {
        label: 'NORMAL',
        badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        color: '#10b981',
      };
    } else if (score <= 70) {
      return {
        label: 'SUSPICIOUS',
        badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        color: '#f59e0b',
      };
    } else {
      return {
        label: 'MALICIOUS',
        badge: 'bg-rose-500/25 text-rose-400 border-rose-500/50',
        color: '#ef4444',
      };
    }
  };

  const riskStyle = getRiskStyle(alert.riskScore);

  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(alert, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="glass-panel w-full max-w-3xl max-h-[92vh] rounded-2xl border border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col bg-[#090f1e]/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#050812] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400">
                  EXPLAINABLE AI THREAT AUDITOR
                </span>
                <span className="text-[11px] font-mono text-slate-500">•</span>
                <span className="text-xs font-mono text-slate-400">ID: {alert.id}</span>
              </div>
              <p className="text-xs text-slate-400">
                Transparent feature attribution & telemetry proof verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors"
              title="Copy STIX / JSON threat alert"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedJson ? 'Copied' : 'JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Hero Threat Banner */}
          <div className="rounded-xl p-5 border border-slate-800/80 bg-gradient-to-r from-[#0c1426] via-[#101b34] to-[#0c1426] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                THREAT DETECTED
              </span>
              <h2 className="text-2xl font-bold font-mono text-white tracking-wide mt-0.5">
                {alert.threat}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-mono text-slate-400">MITRE ATT&CK:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  {alert.mitreTactic} ({alert.mitreId})
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-mono text-slate-400">{alert.timestamp} UTC</span>
              </div>
            </div>

            {/* Score & Confidence Badges */}
            <div className="flex items-center gap-3">
              <div className="text-center p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Risk Score</span>
                <div className="flex items-baseline justify-center gap-1 mt-0.5">
                  <span className="text-2xl font-bold font-mono" style={{ color: riskStyle.color }}>
                    {alert.riskScore}
                  </span>
                  <span className="text-xs font-mono text-slate-500">/ 100</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border mt-1 inline-block font-semibold ${riskStyle.badge}`}>
                  {riskStyle.label}
                </span>
              </div>

              <div className="text-center p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Confidence</span>
                <div className="text-2xl font-bold font-mono text-cyan-300 mt-0.5">
                  {alert.confidence}%
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mt-1 inline-block font-medium">
                  VERIFIED
                </span>
              </div>
            </div>
          </div>

          {/* Section: WHY WAS THIS DETECTED? (Core XAI Requirement) */}
          <div className="rounded-xl p-5 border border-cyan-500/30 bg-[#0b1324] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
                <h3 className="text-xs font-bold font-mono uppercase text-cyan-300 tracking-wider">
                  WHY WAS THIS DETECTED?
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Feature Evidence Checklist
              </span>
            </div>

            {/* Evidence items with explicit checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {alert.evidence.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-[#070b16] border border-cyan-900/50 text-xs font-mono text-slate-200"
                >
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            {/* Feature Impact Bar Breakdown (SHAP / Feature Weights) */}
            {alert.featureWeights && alert.featureWeights.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2.5">
                  <span className="text-slate-300 font-semibold">FEATURE ATTRIBUTION ENGINE (SHAP CONTRIBUTIONS)</span>
                  <span>Impact Weight vs Baseline</span>
                </div>

                <div className="space-y-2.5">
                  {alert.featureWeights.map((fw, i) => (
                    <div key={i} className="text-xs font-mono">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300">{fw.feature}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-300 font-semibold">{fw.value}</span>
                          <span className="text-slate-500 text-[10px]">({fw.baseline})</span>
                          <span className="text-xs font-bold text-rose-400 ml-1">{fw.impactScore}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-rose-500 rounded-full transition-all duration-500"
                          style={{ width: `${fw.impactScore}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section: Telemetry & Network Endpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Endpoints */}
            <div className="rounded-xl p-4 bg-[#0a1020] border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2">
                NETWORK ENDPOINTS
              </span>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">SOURCE IP:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-300">{alert.sourceIp}</span>
                    {isBlocked && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        BLOCKED
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">DESTINATION:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-300">{alert.destinationIp}</span>
                    {isIsolated && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        ISOLATED
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">PROTOCOL:</span>
                  <span className="font-semibold text-slate-200">{alert.telemetry.protocol}</span>
                </div>
              </div>
            </div>

            {/* Raw Telemetry Metrics */}
            <div className="rounded-xl p-4 bg-[#0a1020] border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2">
                RAW TELEMETRY AUDIT
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">CONNECTIONS</span>
                  <span className="text-white font-bold">{alert.telemetry.connections}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">UNIQUE PORTS</span>
                  <span className="text-white font-bold">{alert.telemetry.uniquePorts}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">FAILED LOGINS</span>
                  <span className="text-rose-400 font-bold">{alert.telemetry.failedLogins}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">EGRESS BYTES</span>
                  <span className="text-white font-bold">{alert.telemetry.bytesFormatted}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: RECOMMENDED ACTION */}
          <div className="rounded-xl p-4 bg-gradient-to-r from-slate-900 to-[#0e172a] border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                RECOMMENDED ACTION
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-bold font-mono text-cyan-300">
                  {alert.recommendedAction}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold">
                  ENFORCE POLICY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Zero-trust automated policy recommends isolating compromised internal endpoints and blackholing external attacker IPs.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => onBlockIp(alert.sourceIp)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-colors ${
                  isBlocked
                    ? 'bg-rose-950/50 border border-rose-500/40 text-rose-300'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                <span>{isBlocked ? 'Source Blocked' : 'Block Source IP'}</span>
              </button>

              <button
                onClick={() => onIsolateHost(alert.destinationIp)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-colors ${
                  isIsolated
                    ? 'bg-purple-950/50 border border-purple-500/40 text-purple-300'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isIsolated ? 'Host Isolated' : 'Isolate Host'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#050812] border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Inference Time: 1.4ms • Model: Random Forest Ensemble v2.4</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Auditor
          </button>
        </div>
      </div>
    </div>
  );
};
