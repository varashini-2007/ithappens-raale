export type ThreatType = 
  | 'Normal'
  | 'Port Scan'
  | 'Brute Force'
  | 'Lateral Movement'
  | 'Data Exfiltration';

export type RiskBand = 'NORMAL' | 'SUSPICIOUS' | 'MALICIOUS';

export type AlertStatus = 'ACTIVE' | 'INVESTIGATING' | 'BLOCKED' | 'RESOLVED';

export interface TelemetryData {
  uniquePorts: number;
  connections: number;
  timeWindowSec: number;
  failedLogins: number;
  bytesTransferred: number; // in bytes or MB
  bytesFormatted: string;
  protocol: string;
  destinationDiversity: 'Low' | 'Medium' | 'High';
  newInternalPeers?: number;
  unusualServices?: number;
  sameSourceRepeated?: boolean;
}

export interface FeatureWeight {
  feature: string;
  impactScore: number; // 0-100
  value: string;
  baseline: string;
}

export interface ThreatAlert {
  id: string;
  timestamp: string;
  sourceIp: string;
  destinationIp: string;
  threat: ThreatType;
  riskScore: number; // 0-100
  confidence: number; // 0-100%
  status: AlertStatus;
  evidence: string[];
  telemetry: TelemetryData;
  featureWeights: FeatureWeight[];
  mitreTactic: string;
  mitreId: string;
  recommendedAction: string;
  attackStoryStep?: number; // 1 to 4 for the coordinated attack story
}

export interface SystemMetrics {
  totalEvents: number;
  activeThreats: number;
  criticalAlerts: number;
  averageRiskScore: number;
  filteredNoiseEvents: number;
}

export interface NetworkConnectionFlow {
  id: string;
  sourceIp: string;
  destinationIp: string;
  protocol: string;
  port: number;
  bytes: string;
  threat: ThreatType;
  riskScore: number;
  active: boolean;
}

export interface PolicyConfig {
  maxAllowedRisk: number; // Default 70
  autoBlockBreaches: boolean;
  notifySecOps: boolean;
}
