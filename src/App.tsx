import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ThreatAlert, 
  SystemMetrics, 
  PolicyConfig, 
  NetworkConnectionFlow, 
  ThreatType 
} from './types/cyber';
import { 
  INITIAL_ALERTS, 
  INITIAL_METRICS, 
  INITIAL_NETWORK_FLOWS, 
  SCENARIO_TEMPLATES 
} from './data/mockData';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DemoAttackSimulator } from './components/DemoAttackSimulator';
import { MetricCards } from './components/MetricCards';
import { ThreatRiskOverview } from './components/ThreatRiskOverview';
import { ThreatDistribution } from './components/ThreatDistribution';
import { RecentAlertsTable } from './components/RecentAlertsTable';
import { AttackTimeline } from './components/AttackTimeline';
import { PolicyGuardCard } from './components/PolicyGuardCard';
import { ExplainableModal } from './components/ExplainableModal';
import { LiveThreatFeed } from './components/LiveThreatFeed';
import { AlertHistoryView } from './components/AlertHistoryView';
import { NetworkActivityView } from './components/NetworkActivityView';
import { MLIntelligenceSection } from './components/MLIntelligenceSection';
import { NoiseControlCard } from './components/NoiseControlCard';
import { JudgeDemoGuideModal } from './components/JudgeDemoGuideModal';
import { MLPlayground } from './components/MLPlayground';
import TerminalRain, { GLYPH_PRESETS } from './components/TerminalRain';

export const App: React.FC = () => {
  // Local storage persistence or fallback to defaults
  const [alerts, setAlerts] = useState<ThreatAlert[]>(() => {
    try {
      const saved = localStorage.getItem('cs_alerts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ALERTS;
  });

  const [metrics, setMetrics] = useState<SystemMetrics>(() => {
    try {
      const saved = localStorage.getItem('cs_metrics');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_METRICS;
  });

  const [policy, setPolicy] = useState<PolicyConfig>(() => {
    try {
      const saved = localStorage.getItem('cs_policy');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      maxAllowedRisk: 70, // Default 70 as specified in requirement 8
      autoBlockBreaches: true,
      notifySecOps: true,
    };
  });

  const [networkFlows, setNetworkFlows] = useState<NetworkConnectionFlow[]>(() => {
    try {
      const saved = localStorage.getItem('cs_flows');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NETWORK_FLOWS;
  });

  const [activeTab, setActiveTab] = useState<NavTab>('command-center');
  const [selectedAlert, setSelectedAlert] = useState<ThreatAlert | null>(null);
  const [lastSimulated, setLastSimulated] = useState<ThreatType | null>(null);
  const [isSimulatingSequence, setIsSimulatingSequence] = useState<boolean>(false);
  const [blockedIps, setBlockedIps] = useState<Set<string>>(new Set());
  const [isolatedHosts, setIsolatedHosts] = useState<Set<string>>(new Set());
  const [isJudgeGuideOpen, setIsJudgeGuideOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cs_alerts', JSON.stringify(alerts));
      localStorage.setItem('cs_metrics', JSON.stringify(metrics));
      localStorage.setItem('cs_policy', JSON.stringify(policy));
      localStorage.setItem('cs_flows', JSON.stringify(networkFlows));
    } catch (e) {
      console.error(e);
    }
  }, [alerts, metrics, policy, networkFlows]);

  // Dynamic calculations
  const highestRisk = useMemo(() => {
    if (alerts.length === 0) return 18;
    return Math.max(...alerts.map((a) => a.riskScore));
  }, [alerts]);

  const activeThreatCount = useMemo(() => {
    return alerts.filter((a) => a.status === 'ACTIVE' && a.threat !== 'Normal').length;
  }, [alerts]);

  const criticalCount = useMemo(() => {
    return alerts.filter((a) => a.riskScore >= 71).length;
  }, [alerts]);

  const isPolicyBreached = highestRisk > policy.maxAllowedRisk;

  // Handler: Simulate Single Threat Scenario (Requirement 4 & 5)
  const handleSimulateThreat = useCallback((threatType: 'Port Scan' | 'Brute Force' | 'Lateral Movement' | 'Data Exfiltration') => {
    const generator = SCENARIO_TEMPLATES[threatType];
    const newAlert = generator(alerts.length + 1);

    // 1. Prepend alert to alert feed
    setAlerts((prev) => [newAlert, ...prev]);

    // 2. Update threat counters & metrics
    setMetrics((prev) => {
      const newTotal = prev.totalEvents + newAlert.telemetry.connections;
      const newActive = prev.activeThreats + 1;
      const newCritical = newAlert.riskScore >= 71 ? prev.criticalAlerts + 1 : prev.criticalAlerts;
      // Recompute average
      const newAvg = Math.round((prev.averageRiskScore * 3 + newAlert.riskScore) / 4);
      return {
        ...prev,
        totalEvents: newTotal,
        activeThreats: newActive,
        criticalAlerts: newCritical,
        averageRiskScore: newAvg,
      };
    });

    // 3. Update network flows
    setNetworkFlows((prev) => {
      const existing = prev.find((f) => f.threat === threatType);
      if (existing) {
        return prev.map((f) => f.threat === threatType ? { ...f, active: true, riskScore: newAlert.riskScore } : f);
      }
      return [
        {
          id: `NF-${Date.now()}`,
          sourceIp: newAlert.sourceIp,
          destinationIp: newAlert.destinationIp,
          protocol: newAlert.telemetry.protocol,
          port: newAlert.telemetry.uniquePorts,
          bytes: newAlert.telemetry.bytesFormatted,
          threat: newAlert.threat,
          riskScore: newAlert.riskScore,
          active: true,
        },
        ...prev,
      ];
    });

    // 4. Update state tracking
    setLastSimulated(threatType);

    // 5. Open/show alert explanation as required by step 6 in Requirement 4
    setSelectedAlert(newAlert);
  }, [alerts.length]);

  // Handler: Full Attack Kill Chain Sequence
  const handleSimulateKillChain = useCallback(() => {
    setIsSimulatingSequence(true);
    const order: Array<'Port Scan' | 'Brute Force' | 'Lateral Movement' | 'Data Exfiltration'> = [
      'Port Scan',
      'Brute Force',
      'Lateral Movement',
      'Data Exfiltration',
    ];

    order.forEach((threat, idx) => {
      setTimeout(() => {
        const generator = SCENARIO_TEMPLATES[threat];
        const newAlert = generator(Date.now() + idx);
        setAlerts((prev) => [newAlert, ...prev]);
        setLastSimulated(threat);

        if (idx === order.length - 1) {
          setIsSimulatingSequence(false);
          setSelectedAlert(newAlert);
          setMetrics((prev) => ({
            ...prev,
            totalEvents: prev.totalEvents + 1200,
            activeThreats: prev.activeThreats + 4,
            criticalAlerts: prev.criticalAlerts + 4,
            averageRiskScore: 89,
          }));
        }
      }, idx * 700);
    });
  }, []);

  // Handler: Reset Demo (Requirement 4 & 14)
  const handleResetDemo = useCallback(() => {
    setAlerts(INITIAL_ALERTS);
    setMetrics(INITIAL_METRICS);
    setPolicy({
      maxAllowedRisk: 70,
      autoBlockBreaches: true,
      notifySecOps: true,
    });
    setNetworkFlows(INITIAL_NETWORK_FLOWS);
    setBlockedIps(new Set());
    setIsolatedHosts(new Set());
    setLastSimulated(null);
    setSelectedAlert(null);
    setIsSimulatingSequence(false);
    localStorage.removeItem('cs_alerts');
    localStorage.removeItem('cs_metrics');
    localStorage.removeItem('cs_policy');
    localStorage.removeItem('cs_flows');
  }, []);

  // Handler: Block IP
  const handleBlockIp = useCallback((ip: string) => {
    setBlockedIps((prev) => new Set([...prev, ip]));
    setAlerts((prev) =>
      prev.map((a) => (a.sourceIp === ip ? { ...a, status: 'BLOCKED' } : a))
    );
  }, []);

  // Handler: Isolate Host
  const handleIsolateHost = useCallback((ip: string) => {
    setIsolatedHosts((prev) => new Set([...prev, ip]));
  }, []);

  // Handler: Inject Benign Telemetry Packet
  const handleInjectBenign = useCallback(() => {
    const benignAlert: ThreatAlert = {
      id: `CS-BEN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toTimeString().slice(0, 8),
      sourceIp: `192.168.1.${Math.floor(10 + Math.random() * 80)}`,
      destinationIp: '192.168.1.1',
      threat: 'Normal',
      riskScore: Math.floor(8 + Math.random() * 12),
      confidence: 99,
      status: 'RESOLVED',
      mitreTactic: 'Normal Activity',
      mitreId: 'None',
      recommendedAction: 'MONITOR / LOG',
      evidence: [
        'Routine DHCP broadcast and heartbeat sync',
        'Payload hash matches internal trusted whitelist',
      ],
      telemetry: {
        uniquePorts: 1,
        connections: 2,
        timeWindowSec: 15,
        failedLogins: 0,
        bytesTransferred: 520,
        bytesFormatted: '520 B',
        protocol: 'DHCP / UDP 67',
        destinationDiversity: 'Low',
      },
      featureWeights: [
        { feature: 'DHCP Renewal Timing', impactScore: 4, value: 'Regular', baseline: 'Approved' },
      ],
    };
    setAlerts((prev) => [benignAlert, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      totalEvents: prev.totalEvents + 1,
      filteredNoiseEvents: prev.filteredNoiseEvents + 1,
    }));
  }, []);

  // Handler: Ingest Alert from ML Model Playground
  const handleIngestMLAlert = useCallback((alert: ThreatAlert) => {
    setAlerts((prev) => [alert, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      totalEvents: prev.totalEvents + alert.telemetry.connections,
      activeThreats: alert.threat !== 'Normal' ? prev.activeThreats + 1 : prev.activeThreats,
      criticalAlerts: alert.riskScore >= 71 ? prev.criticalAlerts + 1 : prev.criticalAlerts,
      averageRiskScore: Math.round((prev.averageRiskScore * 3 + alert.riskScore) / 4),
    }));
    setNetworkFlows((prev) => [
      {
        id: `NF-ML-${Date.now()}`,
        sourceIp: alert.sourceIp,
        destinationIp: alert.destinationIp,
        protocol: alert.telemetry.protocol,
        port: alert.telemetry.uniquePorts,
        bytes: alert.telemetry.bytesFormatted,
        threat: alert.threat,
        riskScore: alert.riskScore,
        active: true,
      },
      ...prev,
    ]);
    setSelectedAlert(alert);
  }, []);

  // Handler: Judge Step Execution
  const handleRunJudgeStep = useCallback((stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        setActiveTab('command-center');
        break;
      case 2:
        setActiveTab('command-center');
        handleSimulateThreat('Brute Force');
        break;
      case 3:
        setActiveTab('command-center');
        break;
      case 4: {
        const bfAlert = alerts.find((a) => a.threat === 'Brute Force') || alerts[0];
        setSelectedAlert(bfAlert);
        break;
      }
      case 5:
        setActiveTab('command-center');
        handleSimulateThreat('Data Exfiltration');
        break;
      case 6:
        setActiveTab('attack-timeline');
        break;
      case 7:
        setActiveTab('policy-guard');
        setPolicy((prev) => ({ ...prev, maxAllowedRisk: 70 }));
        break;
      case 8:
        setActiveTab('alert-history');
        break;
      default:
        setActiveTab('command-center');
    }
  }, [alerts, handleSimulateThreat]);

  const latestAlert = alerts.find((a) => a.threat !== 'Normal') || alerts[0];

  return (
    <div className="min-h-screen bg-[#060a13] text-slate-100 flex flex-col font-sans cyber-grid selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Background Terminal Rain Animation from React Bits Pro */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30 overflow-hidden">
        <TerminalRain
          colors={['#00f0ff', '#ffffff']}
          backgroundColor="#060a13"
          mode="auto"
          glyphs={GLYPH_PRESETS.katakana}
          glyphSize={15}
          spacing={1.15}
          density={0.38}
          trail={18}
          speed={0.85}
          variance={0.35}
          depth={0.5}
          glow={0}
          interactive={true}
          bulletTime={true}
          slowRadius={150}
          slowStrength={0.65}
          clickBurst={true}
          burstSize={1.0}
          quality={1}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          metrics={metrics}
          policy={policy}
          highestRisk={highestRisk}
          onOpenDemoGuide={() => setIsJudgeGuideOpen(true)}
        />

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          threatCount={activeThreatCount}
          criticalCount={criticalCount}
          isPolicyBreached={isPolicyBreached}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-x-hidden max-w-[1600px] mx-auto w-full">
          {/* Hero Section Banner */}
          <div className="rounded-xl p-4 sm:p-5 border border-slate-800 bg-[#0c1424]/90 backdrop-blur-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-wider text-white">
                  CYBERSENTINEL <span className="text-cyan-400">AI</span>
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-cyan-300 border border-slate-800 font-semibold">
                  v3.2 PROD
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-cyan-300/80 mt-1">
                "Detect. Explain. Score. Act."
              </p>
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
                An explainable AI security sentinel that transforms network telemetry into prioritized, evidence-backed threat decisions.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsJudgeGuideOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono font-medium flex items-center gap-2 transition-colors"
              >
                <span>Judge 2-Min Demo</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-950 text-cyan-400 border border-slate-800">
                  Guide
                </span>
              </button>
            </div>
          </div>

          {/* Prominent Demo Attack Simulator (Requirement 4) */}
          <DemoAttackSimulator
            onSimulate={handleSimulateThreat}
            onReset={handleResetDemo}
            onSimulateSequence={handleSimulateKillChain}
            lastSimulated={lastSimulated}
            isSimulatingSequence={isSimulatingSequence}
          />

          {/* Tab 1: Command Center */}
          {activeTab === 'command-center' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Top Metric Cards */}
              <MetricCards metrics={metrics} highestRisk={highestRisk} />

              {/* Main Visual Sections Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Section A: Threat Risk Overview */}
                <ThreatRiskOverview
                  highestRisk={highestRisk}
                  latestAlert={latestAlert}
                  onInspectAlert={setSelectedAlert}
                />

                {/* Section B: Threat Distribution */}
                <ThreatDistribution alerts={alerts} />
              </div>

              {/* Policy Guard & Noise Control Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PolicyGuardCard
                  policy={policy}
                  onUpdatePolicy={setPolicy}
                  currentHighestRisk={highestRisk}
                  onAutoBlockAllBreaches={() => {
                    alerts
                      .filter((a) => a.riskScore > policy.maxAllowedRisk)
                      .forEach((a) => handleBlockIp(a.sourceIp));
                  }}
                />

                <NoiseControlCard totalFiltered={metrics.filteredNoiseEvents} />
              </div>

              {/* Attack Story / Timeline */}
              <AttackTimeline
                alerts={alerts}
                onSelectAlert={setSelectedAlert}
              />

              {/* Recent Threat Alerts Table */}
              <RecentAlertsTable
                alerts={alerts}
                onInspectAlert={setSelectedAlert}
                maxRows={6}
              />

              {/* Network Telemetry Activity Flows */}
              <NetworkActivityView flows={networkFlows} />

              {/* AI Detection Engine Status */}
              <MLIntelligenceSection />
            </div>
          )}

          {/* Tab 2: Live Threats */}
          {activeTab === 'live-threats' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <LiveThreatFeed
                alerts={alerts}
                onInspectAlert={setSelectedAlert}
                onInjectBenignPacket={handleInjectBenign}
              />
              <NetworkActivityView flows={networkFlows} />
            </div>
          )}

          {/* Tab: ML Playground (Live Machine Learning Inference) */}
          {activeTab === 'ml-playground' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <MLPlayground onIngestAlert={handleIngestMLAlert} />
              <MLIntelligenceSection />
            </div>
          )}

          {/* Tab 3: AI Detection & Explainable Inference */}
          {activeTab === 'ai-detection' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <MLPlayground onIngestAlert={handleIngestMLAlert} />
              <MLIntelligenceSection />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ThreatDistribution alerts={alerts} />
                <NoiseControlCard totalFiltered={metrics.filteredNoiseEvents} />
              </div>
            </div>
          )}

          {/* Tab 4: Attack Timeline */}
          {activeTab === 'attack-timeline' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <AttackTimeline
                alerts={alerts}
                onSelectAlert={setSelectedAlert}
              />
              <NetworkActivityView flows={networkFlows} />
            </div>
          )}

          {/* Tab 5: Alert History */}
          {activeTab === 'alert-history' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <AlertHistoryView
                alerts={alerts}
                onInspectAlert={setSelectedAlert}
              />
            </div>
          )}

          {/* Tab 6: Policy Guard */}
          {activeTab === 'policy-guard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <PolicyGuardCard
                policy={policy}
                onUpdatePolicy={setPolicy}
                currentHighestRisk={highestRisk}
                onAutoBlockAllBreaches={() => {
                  alerts
                    .filter((a) => a.riskScore > policy.maxAllowedRisk)
                    .forEach((a) => handleBlockIp(a.sourceIp));
                }}
              />
              <RecentAlertsTable
                alerts={alerts}
                onInspectAlert={setSelectedAlert}
                maxRows={8}
              />
            </div>
          )}
        </main>
      </div>

      {/* Explainable AI Modal / Drawer (Requirement 6) */}
      <ExplainableModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onBlockIp={handleBlockIp}
        onIsolateHost={handleIsolateHost}
        blockedIps={blockedIps}
        isolatedHosts={isolatedHosts}
      />

      {/* Judge Demonstration Flow Modal (Requirement 17) */}
      <JudgeDemoGuideModal
        isOpen={isJudgeGuideOpen}
        onClose={() => setIsJudgeGuideOpen(false)}
        onRunStepAction={handleRunJudgeStep}
      />
      </div>
    </div>
  );
};

export default App;
