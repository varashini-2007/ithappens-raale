import React from 'react';
import { Cpu, CheckCircle2, Layers, Search, ShieldCheck, Database, Compass, BarChart3, Binary } from 'lucide-react';

export const MLIntelligenceSection: React.FC = () => {
  const models = [
    {
      name: 'ANOMALY DETECTOR',
      algorithm: 'Isolation Forest',
      status: 'ACTIVE',
      latency: '1.2ms',
      precision: '98.8%',
      purpose: 'Unsupervised telemetry deviation filter',
      question: 'Is this behavior unusual?',
    },
    {
      name: 'THREAT CLASSIFIER',
      algorithm: 'Random Forest Ensemble',
      status: 'ACTIVE',
      latency: '1.6ms',
      precision: '96.4%',
      purpose: 'Supervised multi-class attack fingerprinting',
      question: 'What type of threat does it resemble?',
    },
    {
      name: 'BEHAVIORAL ANALYSIS',
      algorithm: 'Temporal Graph Correlator',
      status: 'ACTIVE',
      latency: '3.1ms',
      precision: '94.2%',
      purpose: 'Multi-stage lateral hop and kill-chain tracker',
      question: 'How dangerous is it?',
    },
    {
      name: 'EVIDENCE ENGINE',
      algorithm: 'SHAP Feature Attribution (XAI)',
      status: 'ACTIVE',
      latency: '0.9ms',
      precision: '100% Deterministic',
      purpose: 'Explainable feature contribution breakdown',
      question: 'Why was this decision made?',
    },
  ];

  return (
    <div className="glass-panel rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-mono uppercase text-slate-200 tracking-wider">
              AI Detection & Inference Engine
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/50">
              DUAL-STAGE ENSEMBLE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent four-tier pipeline: Anomaly &rarr; Classifier &rarr; Risk Engine &rarr; Evidence Engine
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>INFERENCE ENGINE ONLINE</span>
        </div>
      </div>

      {/* 4 Pipeline Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 my-2">
        {models.map((mod, i) => (
          <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  {mod.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {mod.status}
                </span>
              </div>

              <h4 className="text-xs font-mono font-semibold text-white">
                {mod.algorithm}
              </h4>

              {/* Guiding Question */}
              <div className="mt-2.5 p-2 rounded bg-slate-950/80 border border-slate-850">
                <span className="text-[10px] font-mono text-slate-500 block uppercase">CORE QUESTION:</span>
                <span className="text-xs font-mono text-amber-300 font-semibold italic">
                  "{mod.question}"
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Latency: {mod.latency}</span>
              <span className="text-slate-300">{mod.precision}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Architectural Explanation */}
      <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-850 text-xs font-mono text-slate-400">
        <span className="text-cyan-300 font-semibold block mb-1">DECISION LOGIC FLOW:</span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
          <div>
            <span className="text-slate-300 font-bold">1. Anomaly:</span> Flags statistically abnormal connection bursts and port distributions.
          </div>
          <div>
            <span className="text-slate-300 font-bold">2. Threat Class:</span> Maps feature vectors against 5 signature profiles.
          </div>
          <div>
            <span className="text-slate-300 font-bold">3. Risk Engine:</span> Dynamically evaluates threat criticality from 0 to 100.
          </div>
          <div>
            <span className="text-slate-300 font-bold">4. Evidence Engine:</span> Computes human-readable feature justifications for SecOps review.
          </div>
        </div>
      </div>
    </div>
  );
};
