import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  BarChart3, 
  Binary, 
  Sliders, 
  Zap,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Key,
  Network,
  FileUp
} from 'lucide-react';
import { runMLInference, createAlertFromML, RawTelemetryInput, MLInferenceResult } from '../ml/inferenceEngine';
import { ThreatAlert, ThreatType } from '../types/cyber';

interface MLPlaygroundProps {
  onIngestAlert: (alert: ThreatAlert) => void;
}

export const MLPlayground: React.FC<MLPlaygroundProps> = ({ onIngestAlert }) => {
  // Input state
  const [input, setInput] = useState<RawTelemetryInput>({
    uniquePorts: 42,
    connections: 180,
    timeWindowSec: 30,
    failedLogins: 0,
    bytesTransferred: 58200,
    newInternalPeers: 0,
    unusualServices: 0,
    protocol: 'TCP SYN',
    sourceIp: '192.168.1.105',
    destinationIp: '192.168.1.0/24',
  });

  const [inferenceResult, setInferenceResult] = useState<MLInferenceResult | null>(() => {
    return runMLInference({
      uniquePorts: 42,
      connections: 180,
      timeWindowSec: 30,
      failedLogins: 0,
      bytesTransferred: 58200,
      newInternalPeers: 0,
      unusualServices: 0,
    });
  });

  const [justIngested, setJustIngested] = useState(false);

  // Run live inference
  const handleRunInference = () => {
    const result = runMLInference(input);
    setInferenceResult(result);
    setJustIngested(false);
  };

  // Preset loaders
  const loadPreset = (presetName: ThreatType | 'Zero-Day') => {
    let preset: RawTelemetryInput;
    switch (presetName) {
      case 'Normal':
        preset = {
          uniquePorts: 2,
          connections: 12,
          timeWindowSec: 60,
          failedLogins: 0,
          bytesTransferred: 45000,
          newInternalPeers: 0,
          unusualServices: 0,
          protocol: 'HTTPS / TLS 1.3',
          sourceIp: '192.168.1.45',
          destinationIp: '192.168.1.1',
        };
        break;
      case 'Port Scan':
        preset = {
          uniquePorts: 42,
          connections: 180,
          timeWindowSec: 30,
          failedLogins: 0,
          bytesTransferred: 58200,
          newInternalPeers: 0,
          unusualServices: 0,
          protocol: 'TCP SYN',
          sourceIp: '192.168.1.105',
          destinationIp: '192.168.1.0/24',
        };
        break;
      case 'Brute Force':
        preset = {
          uniquePorts: 1,
          connections: 45,
          timeWindowSec: 60,
          failedLogins: 37,
          bytesTransferred: 142000,
          newInternalPeers: 0,
          unusualServices: 0,
          protocol: 'SSH / Port 22',
          sourceIp: '192.168.1.10',
          destinationIp: '192.168.1.50',
        };
        break;
      case 'Lateral Movement':
        preset = {
          uniquePorts: 5,
          connections: 92,
          timeWindowSec: 120,
          failedLogins: 2,
          bytesTransferred: 4800000,
          newInternalPeers: 8,
          unusualServices: 5,
          protocol: 'SMB / RPC',
          sourceIp: '192.168.1.50',
          destinationIp: '192.168.1.20',
        };
        break;
      case 'Data Exfiltration':
        preset = {
          uniquePorts: 2,
          connections: 115,
          timeWindowSec: 180,
          failedLogins: 0,
          bytesTransferred: 891289600, // 850 MB
          newInternalPeers: 1,
          unusualServices: 1,
          protocol: 'HTTPS Encrypted Tunnel',
          sourceIp: '192.168.1.20',
          destinationIp: '45.33.32.156',
        };
        break;
      case 'Zero-Day':
        preset = {
          uniquePorts: 64,
          connections: 280,
          timeWindowSec: 45,
          failedLogins: 18,
          bytesTransferred: 320000000,
          newInternalPeers: 12,
          unusualServices: 7,
          protocol: 'Custom Encrypted',
          sourceIp: '10.0.8.99',
          destinationIp: '192.168.1.250',
        };
        break;
    }
    setInput(preset);
    const result = runMLInference(preset);
    setInferenceResult(result);
    setJustIngested(false);
  };

  // Ingest to live dashboard
  const handleIngestToSOC = () => {
    if (!inferenceResult) return;
    const alert = createAlertFromML(input, inferenceResult);
    onIngestAlert(alert);
    setJustIngested(true);
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score <= 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/20 border-rose-500/40 font-bold';
  };

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-cyan-500/40 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono uppercase text-white tracking-wider flex items-center gap-2">
                LIVE MACHINE LEARNING MODEL PLAYGROUND
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tweak raw telemetry feature vectors and run real-time Random Forest & Isolation Forest inference in &lt;2ms
              </p>
            </div>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-slate-400 mr-1">Presets:</span>
          {(['Normal', 'Port Scan', 'Brute Force', 'Lateral Movement', 'Data Exfiltration', 'Zero-Day'] as const).map((p) => (
            <button
              key={p}
              onClick={() => loadPreset(p)}
              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs vs ML Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Feature Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              TELEMETRY FEATURE VECTOR
            </span>
            <span className="text-[10px] font-mono text-slate-500">11 ENGINEERED DIMS</span>
          </div>

          {/* Slider 1: Failed Logins */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300">Failed Logins:</span>
              <span className="text-rose-400 font-bold">{input.failedLogins}</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              value={input.failedLogins}
              onChange={(e) => setInput({ ...input, failedLogins: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-900 rounded appearance-none cursor-pointer accent-rose-400"
            />
          </div>

          {/* Slider 2: Unique Ports */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300">Unique Dest Ports:</span>
              <span className="text-amber-400 font-bold">{input.uniquePorts}</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={input.uniquePorts}
              onChange={(e) => setInput({ ...input, uniquePorts: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-900 rounded appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Slider 3: Connection Bursts */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300">Connection Count:</span>
              <span className="text-cyan-300 font-bold">{input.connections}</span>
            </div>
            <input
              type="range"
              min="1"
              max="300"
              value={input.connections}
              onChange={(e) => setInput({ ...input, connections: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-900 rounded appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Slider 4: Time Window */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300">Time Window (Seconds):</span>
              <span className="text-slate-200 font-bold">{input.timeWindowSec}s</span>
            </div>
            <input
              type="range"
              min="10"
              max="300"
              value={input.timeWindowSec}
              onChange={(e) => setInput({ ...input, timeWindowSec: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-900 rounded appearance-none cursor-pointer accent-slate-400"
            />
          </div>

          {/* Slider 5: Bytes Transferred */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300">Bytes Transferred:</span>
              <span className="text-purple-300 font-bold">
                {input.bytesTransferred >= 1024 * 1024
                  ? `${(input.bytesTransferred / (1024 * 1024)).toFixed(1)} MB`
                  : `${(input.bytesTransferred / 1024).toFixed(0)} KB`}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="1200000000"
              step="10000000"
              value={input.bytesTransferred}
              onChange={(e) => setInput({ ...input, bytesTransferred: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-900 rounded appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          {/* Slider 6: New Peers & Unusual Services */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">New Peers:</span>
                <span className="text-cyan-300 font-bold">{input.newInternalPeers}</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={input.newInternalPeers}
                onChange={(e) => setInput({ ...input, newInternalPeers: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-900 rounded appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Unusual Svc:</span>
                <span className="text-amber-300 font-bold">{input.unusualServices}</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={input.unusualServices}
                onChange={(e) => setInput({ ...input, unusualServices: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-900 rounded appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          {/* Execution Button */}
          <button
            onClick={handleRunInference}
            className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors mt-3"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>EXECUTE LIVE ML MODEL INFERENCE</span>
          </button>
        </div>

        {/* Right Column: Model Decisions & Probabilities (7 cols) */}
        {inferenceResult && (
          <div className="lg:col-span-7 space-y-4">
            {/* Top Inference Result Banner */}
            <div className="p-4 rounded-xl border border-slate-800 bg-[#0c1424] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  MODEL PREDICTION
                </span>
                <h4 className="text-xl font-bold font-mono text-white flex items-center gap-2 mt-0.5">
                  {inferenceResult.predictedClass}
                  <span className={`text-xs px-2 py-0.5 rounded border ${getRiskColor(inferenceResult.calculatedRiskScore)}`}>
                    Risk {inferenceResult.calculatedRiskScore} / 100
                  </span>
                </h4>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
                  <span>Confidence: <strong className="text-cyan-300">{inferenceResult.confidence}%</strong></span>
                  <span>•</span>
                  <span>Latency: <strong className="text-emerald-400">{inferenceResult.inferenceTimeMs}ms</strong></span>
                  <span>•</span>
                  <span>Trees: <strong className="text-slate-300">20 Estimators</strong></span>
                </div>
              </div>

              {/* Ingest to SOC button */}
              <button
                onClick={handleIngestToSOC}
                disabled={justIngested}
                className={`px-3.5 py-2 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  justIngested
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold'
                }`}
              >
                {justIngested ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                <span>{justIngested ? 'Ingested into SOC' : 'Ingest to Dashboard'}</span>
              </button>
            </div>

            {/* Posterior Class Probabilities (Random Forest Multi-Class Votes) */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-2.5">
                RANDOM FOREST POSTERIOR PROBABILITY DISTRIBUTION:
              </span>
              <div className="space-y-2">
                {(Object.keys(inferenceResult.classProbabilities) as ThreatType[]).map((cls) => {
                  const prob = inferenceResult.classProbabilities[cls];
                  const isTop = cls === inferenceResult.predictedClass;
                  return (
                    <div key={cls} className="text-xs font-mono">
                      <div className="flex items-center justify-between mb-1">
                        <span className={isTop ? 'text-white font-bold' : 'text-slate-400'}>
                          {cls}
                        </span>
                        <span className={isTop ? 'text-cyan-300 font-bold' : 'text-slate-400'}>
                          {prob}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isTop ? 'bg-cyan-400' : 'bg-slate-700'
                          }`}
                          style={{ width: `${prob}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Anomaly & SHAP Attributions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Anomaly Score Card */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  ISOLATION FOREST ANOMALY SCORE
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-white">
                    {inferenceResult.anomalyScore}
                  </span>
                  <span className="text-xs font-mono text-slate-500">/ 1.00</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ml-auto ${
                    inferenceResult.isAnomaly ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {inferenceResult.isAnomaly ? 'ANOMALOUS' : 'NORMAL'}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 mt-2">
                  <div
                    className="h-full bg-rose-500 transition-all duration-300"
                    style={{ width: `${inferenceResult.anomalyScore * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* MITRE Mapping */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  MITRE ATT&CK ALIGNMENT
                </span>
                <div className="font-mono text-xs font-bold text-cyan-300 mt-1">
                  {inferenceResult.mitreTactic} ({inferenceResult.mitreId})
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1.5">
                  Action: <strong className="text-white">{inferenceResult.recommendedAction}</strong>
                </div>
              </div>
            </div>

            {/* Generated Feature Evidence Checklist */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                GENERATED FEATURE EVIDENCE (EXPLAINABILITY AUDIT):
              </span>
              {inferenceResult.generatedEvidence.map((ev, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{ev}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
