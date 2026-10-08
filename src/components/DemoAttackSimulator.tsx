import React from 'react';
import { 
  Zap, 
  RotateCcw, 
  ShieldAlert, 
  Key, 
  Network, 
  FileUp, 
  Play, 
  CheckCircle,
  HelpCircle,
  Flame
} from 'lucide-react';
import { ThreatType } from '../types/cyber';

interface DemoAttackSimulatorProps {
  onSimulate: (threat: 'Port Scan' | 'Brute Force' | 'Lateral Movement' | 'Data Exfiltration') => void;
  onReset: () => void;
  onSimulateSequence: () => void;
  lastSimulated: ThreatType | null;
  isSimulatingSequence: boolean;
}

export const DemoAttackSimulator: React.FC<DemoAttackSimulatorProps> = ({
  onSimulate,
  onReset,
  onSimulateSequence,
  lastSimulated,
  isSimulatingSequence,
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#0c1424]/90 p-4 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Title & Description */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 mt-0.5">
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-semibold tracking-wider uppercase font-mono text-cyan-300">
                ATTACK SIMULATION CONSOLE
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-900 text-slate-400 border border-slate-800">
                EVALUATION READY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Inject deterministic telemetry attacks to test AI classification, XAI evidence, risk scoring, and policy actions.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Simulate Port Scan */}
          <button
            id="btn-simulate-port-scan"
            onClick={() => onSimulate('Port Scan')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium font-mono border transition-colors ${
              lastSimulated === 'Port Scan'
                ? 'bg-amber-950/50 border-amber-500/70 text-amber-200'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Port Scan</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-950 text-amber-300/90 border border-slate-800">
              Risk 86
            </span>
          </button>

          {/* Simulate Brute Force */}
          <button
            id="btn-simulate-brute-force"
            onClick={() => onSimulate('Brute Force')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium font-mono border transition-colors ${
              lastSimulated === 'Brute Force'
                ? 'bg-rose-950/50 border-rose-500/70 text-rose-200'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-rose-500/40 text-slate-300 hover:text-rose-300'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-rose-400" />
            <span>Brute Force</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-950 text-rose-300/90 border border-slate-800">
              Risk 91
            </span>
          </button>

          {/* Simulate Lateral Movement */}
          <button
            id="btn-simulate-lateral-movement"
            onClick={() => onSimulate('Lateral Movement')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium font-mono border transition-colors ${
              lastSimulated === 'Lateral Movement'
                ? 'bg-purple-950/50 border-purple-500/70 text-purple-200'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-purple-300'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-purple-400" />
            <span>Lateral Move</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-950 text-purple-300/90 border border-slate-800">
              Risk 82
            </span>
          </button>

          {/* Simulate Data Exfiltration */}
          <button
            id="btn-simulate-data-exfiltration"
            onClick={() => onSimulate('Data Exfiltration')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium font-mono border transition-colors ${
              lastSimulated === 'Data Exfiltration'
                ? 'bg-red-950/50 border-red-500/70 text-red-200'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-red-500/40 text-slate-300 hover:text-red-300'
            }`}
          >
            <FileUp className="w-3.5 h-3.5 text-red-400" />
            <span>Data Exfil</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-950 text-red-300/90 border border-slate-800">
              Risk 96
            </span>
          </button>

          {/* Run Full Attack Kill Chain */}
          <button
            id="btn-simulate-kill-chain"
            onClick={onSimulateSequence}
            disabled={isSimulatingSequence}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-800/60 text-cyan-300 hover:text-white transition-colors"
            title="Sequentially trigger Port Scan -> Brute Force -> Lateral Movement -> Exfiltration"
          >
            <Flame className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isSimulatingSequence ? 'Simulating...' : 'Full Kill-Chain'}</span>
          </button>

          {/* Reset Demo Button */}
          <button
            id="btn-reset-demo"
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium font-mono bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors ml-auto lg:ml-0"
            title="Reset telemetry counters and alerts to baseline state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
