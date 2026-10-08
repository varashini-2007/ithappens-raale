import React from 'react';
import { 
  Shield, 
  Radio, 
  Cpu, 
  Clock, 
  FileText, 
  Sliders, 
  Activity, 
  AlertTriangle,
  ChevronRight,
  Terminal,
  Zap
} from 'lucide-react';

export type NavTab = 
  | 'command-center' 
  | 'live-threats' 
  | 'ml-playground'
  | 'ai-detection' 
  | 'attack-timeline' 
  | 'alert-history' 
  | 'policy-guard';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  threatCount: number;
  criticalCount: number;
  isPolicyBreached: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  threatCount,
  criticalCount,
  isPolicyBreached,
}) => {
  const navItems = [
    {
      id: 'command-center' as NavTab,
      label: 'Command Center',
      icon: <Shield className="w-4 h-4" />,
      badge: null,
    },
    {
      id: 'live-threats' as NavTab,
      label: 'Live Threats',
      icon: <Radio className="w-4 h-4" />,
      badge: threatCount > 0 ? (
        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
          {threatCount}
        </span>
      ) : null,
    },
    {
      id: 'ml-playground' as NavTab,
      label: 'ML Playground',
      icon: <Sliders className="w-4 h-4 text-cyan-400" />,
      badge: (
        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
          Live Model
        </span>
      ),
    },
    {
      id: 'ai-detection' as NavTab,
      label: 'AI Detection',
      icon: <Cpu className="w-4 h-4" />,
      badge: (
        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
          XAI
        </span>
      ),
    },
    {
      id: 'attack-timeline' as NavTab,
      label: 'Attack Timeline',
      icon: <Clock className="w-4 h-4" />,
      badge: criticalCount > 0 ? (
        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
          Kill-Chain
        </span>
      ) : null,
    },
    {
      id: 'alert-history' as NavTab,
      label: 'Alert History',
      icon: <FileText className="w-4 h-4" />,
      badge: null,
    },
    {
      id: 'policy-guard' as NavTab,
      label: 'Policy Guard',
      icon: <Sliders className="w-4 h-4" />,
      badge: isPolicyBreached ? (
        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-0.5">
          <AlertTriangle className="w-2.5 h-2.5" />
          Breach
        </span>
      ) : null,
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#080d1a] border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0">
      <div>
        {/* Navigation list */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1 font-semibold">
            NAVIGATION
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800/80 text-cyan-300 border border-cyan-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick System Telemetry info block in sidebar */}
        <div className="mt-8 p-3 rounded-xl bg-slate-950/70 border border-slate-850 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-400 text-[11px] font-bold mb-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>SOC AGENT STATUS</span>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>Model Pipeline:</span>
              <span className="text-slate-200">Ensemble v2.4</span>
            </div>
            <div className="flex justify-between">
              <span>Ingestion Buffer:</span>
              <span className="text-emerald-400">0.02% Lag</span>
            </div>
            <div className="flex justify-between">
              <span>Policy Status:</span>
              <span className={isPolicyBreached ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                {isPolicyBreached ? 'BREACH' : 'ENFORCED'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="pt-4 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
        <span>CYBERSENTINEL v3.2</span>
        <span className="text-cyan-400">SOC READY</span>
      </div>
    </aside>
  );
};
