import React from 'react';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  ShieldAlert, 
  Sliders, 
  FileText, 
  Eye, 
  Key, 
  FileUp, 
  Clock, 
  Award 
} from 'lucide-react';
import { ThreatType } from '../types/cyber';

interface JudgeDemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunStepAction: (stepNumber: number) => void;
}

export const JudgeDemoGuideModal: React.FC<JudgeDemoGuideModalProps> = ({
  isOpen,
  onClose,
  onRunStepAction,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: 'Show Normal Dashboard',
      description: 'Observe real-time telemetry baseline, 0-100 risk gauge, and active sensor status.',
      actionLabel: 'View Command Center',
      actionType: 'nav-command',
    },
    {
      num: 2,
      title: "Click 'Simulate Brute Force'",
      description: 'Inject 37 failed authentication bursts from 192.168.1.10 targeting port 22.',
      actionLabel: 'Trigger Brute Force',
      actionType: 'simulate-bf',
    },
    {
      num: 3,
      title: 'Observe Immediate Score Update',
      description: 'Dashboard changes to Risk = 91 / 100, Threat = Brute Force, Malicious classification.',
      actionLabel: 'Check Risk Gauge',
      actionType: 'view-risk',
    },
    {
      num: 4,
      title: 'Open Explainable AI Evidence',
      description: 'Audit the exact feature evidence: 37 failed logins / 60s, same source IP, 8x baseline rate.',
      actionLabel: 'Inspect Evidence',
      actionType: 'open-xai',
    },
    {
      num: 5,
      title: "Click 'Simulate Data Exfiltration'",
      description: 'Inject 850 MB bulk egress to external IP 45.33.32.156. Risk escalates to 96 / 100.',
      actionLabel: 'Trigger Exfiltration',
      actionType: 'simulate-ex',
    },
    {
      num: 6,
      title: 'Show Attack Timeline & Story',
      description: 'Show coordinated sequence: Recon -> Credential Access -> Lateral Hop -> Exfiltration.',
      actionLabel: 'View Attack Timeline',
      actionType: 'nav-timeline',
    },
    {
      num: 7,
      title: 'Set Policy Threshold to 70',
      description: 'Demonstrate Policy Guard: Risk 96 > 70 triggers 🚨 POLICY BREACH and Block action.',
      actionLabel: 'Enforce Threshold 70',
      actionType: 'set-policy-70',
    },
    {
      num: 8,
      title: 'Open Alert History Audit Log',
      description: 'Filter and search by IP, verify all telemetry is logged, export CSV proof.',
      actionLabel: 'View Alert History',
      actionType: 'nav-history',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="glass-panel w-full max-w-2xl max-h-[90vh] rounded-2xl border border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col bg-[#090f1e]/98"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#050812] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Award className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono uppercase text-white tracking-wider flex items-center gap-2">
                JUDGE 2-MINUTE DEMONSTRATION FLOW
              </h2>
              <p className="text-xs text-slate-400">
                Follow this exact script to present CYBERSENTINEL AI seamlessly
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row"
            >
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-mono font-bold text-xs shrink-0">
                  {st.num}
                </span>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white">
                    {st.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {st.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onRunStepAction(st.num);
                  onClose();
                }}
                className="self-end sm:self-center px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono font-medium flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <span>{st.actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#050812] border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Demonstration executes in 100% offline local state with zero API delay</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
