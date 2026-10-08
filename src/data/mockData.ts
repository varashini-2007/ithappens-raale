import { ThreatAlert, SystemMetrics, NetworkConnectionFlow, ThreatType } from '../types/cyber';

// Initial realistic alerts on dashboard startup
export const INITIAL_ALERTS: ThreatAlert[] = [
  {
    id: 'CS-8901',
    timestamp: '10:01:14',
    sourceIp: '192.168.1.105',
    destinationIp: '192.168.1.0/24',
    threat: 'Port Scan',
    riskScore: 84,
    confidence: 93,
    status: 'ACTIVE',
    mitreTactic: 'Reconnaissance',
    mitreId: 'T1046',
    recommendedAction: 'BLOCK / INVESTIGATE',
    attackStoryStep: 1,
    evidence: [
      '38 unique destination ports targeted sequentially',
      '165 SYN packets sent in 28 seconds',
      'Rapid connection rate: 5.8 conn/sec',
      'Destination diversity significantly above baseline',
    ],
    telemetry: {
      uniquePorts: 38,
      connections: 165,
      timeWindowSec: 28,
      failedLogins: 0,
      bytesTransferred: 42000,
      bytesFormatted: '42 KB',
      protocol: 'TCP SYN',
      destinationDiversity: 'High',
    },
    featureWeights: [
      { feature: 'Port Sweep Entropy', impactScore: 92, value: '38 unique ports', baseline: '< 3 ports/min' },
      { feature: 'Connection Frequency', impactScore: 86, value: '5.8 pkts/sec', baseline: '0.1 pkts/sec' },
      { feature: 'SYN-Without-ACK Ratio', impactScore: 88, value: '98.5%', baseline: '< 5%' },
      { feature: 'Subnet Fan-Out', impactScore: 78, value: 'Entire /24 range', baseline: 'Single host' },
    ],
  },
  {
    id: 'CS-8894',
    timestamp: '09:56:40',
    sourceIp: '10.0.4.12',
    destinationIp: '10.0.4.1',
    threat: 'Normal',
    riskScore: 12,
    confidence: 99,
    status: 'RESOLVED',
    mitreTactic: 'Normal Activity',
    mitreId: 'None',
    recommendedAction: 'MONITOR / LOG',
    evidence: [
      'Routine NTP synchronization check',
      'Telemetry within normal bounds',
      'Trusted internal gateway',
    ],
    telemetry: {
      uniquePorts: 1,
      connections: 2,
      timeWindowSec: 10,
      failedLogins: 0,
      bytesTransferred: 180,
      bytesFormatted: '180 B',
      protocol: 'UDP / NTP',
      destinationDiversity: 'Low',
    },
    featureWeights: [
      { feature: 'NTP Jitter', impactScore: 8, value: '0.4 ms', baseline: '< 2 ms' },
      { feature: 'Peer Authenticity', impactScore: 5, value: 'Signed', baseline: 'Verified' },
    ],
  },
  {
    id: 'CS-8890',
    timestamp: '09:48:15',
    sourceIp: '172.16.8.55',
    destinationIp: '172.16.8.10',
    threat: 'Normal',
    riskScore: 22,
    confidence: 96,
    status: 'RESOLVED',
    mitreTactic: 'Normal Activity',
    mitreId: 'None',
    recommendedAction: 'MONITOR / LOG',
    evidence: [
      'Kerberos ticket granting request (TGT)',
      'Valid Active Directory credentials verified',
      'Normal workday authentication peak',
    ],
    telemetry: {
      uniquePorts: 2,
      connections: 6,
      timeWindowSec: 45,
      failedLogins: 1,
      bytesTransferred: 12400,
      bytesFormatted: '12.4 KB',
      protocol: 'Kerberos / TCP 88',
      destinationDiversity: 'Low',
    },
    featureWeights: [
      { feature: 'Auth Success Rate', impactScore: 18, value: '85.7%', baseline: '> 80%' },
      { feature: 'Workstation Fingerprint', impactScore: 12, value: 'Known Device', baseline: 'Known' },
    ],
  },
  {
    id: 'CS-8882',
    timestamp: '09:32:04',
    sourceIp: '192.168.1.180',
    destinationIp: '192.168.1.4',
    threat: 'Normal',
    riskScore: 18,
    confidence: 98,
    status: 'RESOLVED',
    mitreTactic: 'Normal Activity',
    mitreId: 'None',
    recommendedAction: 'MONITOR / LOG',
    evidence: [
      'Encrypted TLS session negotiation to local repository',
      'Zero anomaly score reported by Isolation Forest',
      'Standard corporate work hours packet burst',
    ],
    telemetry: {
      uniquePorts: 1,
      connections: 12,
      timeWindowSec: 120,
      failedLogins: 0,
      bytesTransferred: 1450000,
      bytesFormatted: '1.45 MB',
      protocol: 'HTTPS / TLS 1.3',
      destinationDiversity: 'Low',
    },
    featureWeights: [
      { feature: 'TLS Cipher Strength', impactScore: 6, value: 'AES-256-GCM', baseline: 'Approved' },
      { feature: 'Host Reputability', impactScore: 4, value: 'Corporate Git', baseline: 'Whitelisted' },
    ],
  },
];

// Exact scenario builders satisfying specifications in Section 5
export const SCENARIO_TEMPLATES: Record<'Port Scan' | 'Brute Force' | 'Lateral Movement' | 'Data Exfiltration', (seqCounter: number) => ThreatAlert> = {
  'Port Scan': (seqCounter: number) => {
    const id = `CS-PS-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    return {
      id,
      timestamp: timeStr,
      sourceIp: '192.168.1.105',
      destinationIp: '192.168.1.0/24',
      threat: 'Port Scan',
      riskScore: 86,
      confidence: 94,
      status: 'ACTIVE',
      mitreTactic: 'Reconnaissance',
      mitreId: 'T1046',
      recommendedAction: 'BLOCK / INVESTIGATE',
      attackStoryStep: 1,
      evidence: [
        '42 unique destination ports',
        '180 connections in 30 seconds',
        'Rapid connection rate',
        'Destination diversity significantly above baseline',
      ],
      telemetry: {
        uniquePorts: 42,
        connections: 180,
        timeWindowSec: 30,
        failedLogins: 0,
        bytesTransferred: 58200,
        bytesFormatted: '58.2 KB',
        protocol: 'TCP SYN',
        destinationDiversity: 'High',
      },
      featureWeights: [
        { feature: 'Port Entropy Metric', impactScore: 94, value: '42 unique ports', baseline: '1-3 ports/min' },
        { feature: 'Burst Connection Count', impactScore: 91, value: '180 conns in 30s (6/s)', baseline: '< 0.5/s' },
        { feature: 'Unanswered SYN Packets', impactScore: 87, value: '96.2%', baseline: '< 4%' },
        { feature: 'Subnet Destination Diversity', impactScore: 85, value: 'High (Fan-out)', baseline: 'Low (Single)' },
      ],
    };
  },

  'Brute Force': (seqCounter: number) => {
    const id = `CS-BF-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    return {
      id,
      timestamp: timeStr,
      sourceIp: '192.168.1.10',
      destinationIp: '192.168.1.50',
      threat: 'Brute Force',
      riskScore: 91,
      confidence: 95,
      status: 'ACTIVE',
      mitreTactic: 'Credential Access',
      mitreId: 'T1110',
      recommendedAction: 'BLOCK / INVESTIGATE',
      attackStoryStep: 2,
      evidence: [
        '37 failed authentication attempts',
        'Same source IP repeatedly attempted login',
        'Login rate significantly above baseline',
        'Authentication burst detected',
      ],
      telemetry: {
        uniquePorts: 1,
        connections: 39,
        timeWindowSec: 60,
        failedLogins: 37,
        bytesTransferred: 142000,
        bytesFormatted: '142 KB',
        protocol: 'SSH / Port 22',
        destinationDiversity: 'Low',
        sameSourceRepeated: true,
      },
      featureWeights: [
        { feature: 'Failed Authentication Rate', impactScore: 97, value: '37 failed logins / 60s', baseline: '< 1 failure/hr' },
        { feature: 'Source Persistence', impactScore: 93, value: 'Same source 192.168.1.10 repeated', baseline: 'Normal user pool' },
        { feature: 'Temporal Auth Burst', impactScore: 91, value: '8.2x above baseline', baseline: '1.0x baseline' },
        { feature: 'Kerberos/PAM Error Surge', impactScore: 89, value: 'Preauth Failed (Code 24)', baseline: 'Code 0 Success' },
      ],
    };
  },

  'Lateral Movement': (seqCounter: number) => {
    const id = `CS-LM-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    return {
      id,
      timestamp: timeStr,
      sourceIp: '192.168.1.50',
      destinationIp: '192.168.1.20',
      threat: 'Lateral Movement',
      riskScore: 82,
      confidence: 89,
      status: 'ACTIVE',
      mitreTactic: 'Lateral Movement',
      mitreId: 'T1021',
      recommendedAction: 'BLOCK / INVESTIGATE',
      attackStoryStep: 3,
      evidence: [
        'New internal peer relationships detected',
        'Unusual service access',
        'Abnormal internal communication pattern',
      ],
      telemetry: {
        uniquePorts: 5,
        connections: 84,
        timeWindowSec: 120,
        failedLogins: 2,
        bytesTransferred: 4800000,
        bytesFormatted: '4.8 MB',
        protocol: 'SMB / RPC (445/135)',
        destinationDiversity: 'Medium',
        newInternalPeers: 8,
        unusualServices: 5,
      },
      featureWeights: [
        { feature: 'Internal Peer Graph Anomaly', impactScore: 92, value: '8 new internal peers', baseline: '0 new peers/day' },
        { feature: 'Privileged RPC / SMB Pivots', impactScore: 88, value: '5 unusual services accessed', baseline: 'Standard SMB' },
        { feature: 'Internal Connection Velocity', impactScore: 84, value: 'High rate peer-to-peer', baseline: 'Client-to-Server only' },
        { feature: 'Token Impersonation Indicator', impactScore: 79, value: 'Duplicate Admin NTLM Hash', baseline: 'Unique machine account' },
      ],
    };
  },

  'Data Exfiltration': (seqCounter: number) => {
    const id = `CS-EX-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    return {
      id,
      timestamp: timeStr,
      sourceIp: '192.168.1.20',
      destinationIp: '45.33.32.156',
      threat: 'Data Exfiltration',
      riskScore: 96,
      confidence: 97,
      status: 'ACTIVE',
      mitreTactic: 'Exfiltration',
      mitreId: 'T1048',
      recommendedAction: 'BLOCK / INVESTIGATE',
      attackStoryStep: 4,
      evidence: [
        '850 MB outbound transfer',
        'Unusual destination',
        'High destination diversity',
        'Abnormal transfer timing after suspicious activity',
      ],
      telemetry: {
        uniquePorts: 2,
        connections: 112,
        timeWindowSec: 180,
        failedLogins: 0,
        bytesTransferred: 891289600,
        bytesFormatted: '850 MB',
        protocol: 'HTTPS / TLS Tunnel (443)',
        destinationDiversity: 'High',
      },
      featureWeights: [
        { feature: 'Outbound Egress Volume', impactScore: 99, value: '850 MB outbound transfer', baseline: '< 5 MB normal egress' },
        { feature: 'Untrusted Destination IP', impactScore: 96, value: '45.33.32.156 (Low IP Reputation)', baseline: 'Verified CDN' },
        { feature: 'Correlated Kill-Chain Sequence', impactScore: 95, value: 'Followed Port Scan + Brute Force', baseline: 'Isolated event' },
        { feature: 'Temporal Departure Baseline', impactScore: 93, value: 'Off-hours bulk encryption tunnel', baseline: 'Normal business schedule' },
      ],
    };
  },
};

// Initial system metrics
export const INITIAL_METRICS: SystemMetrics = {
  totalEvents: 14892,
  activeThreats: 1,
  criticalAlerts: 1,
  averageRiskScore: 32,
  filteredNoiseEvents: 14210,
};

// Network connection flows for the Network Activity section
export const INITIAL_NETWORK_FLOWS: NetworkConnectionFlow[] = [
  {
    id: 'NF-1',
    sourceIp: '192.168.1.10',
    destinationIp: '192.168.1.50',
    protocol: 'SSH / 22',
    port: 22,
    bytes: '142 KB',
    threat: 'Brute Force',
    riskScore: 91,
    active: true,
  },
  {
    id: 'NF-2',
    sourceIp: '192.168.1.10',
    destinationIp: '192.168.1.20',
    protocol: 'SMB / 445',
    port: 445,
    bytes: '68 KB',
    threat: 'Lateral Movement',
    riskScore: 82,
    active: true,
  },
  {
    id: 'NF-3',
    sourceIp: '192.168.1.15',
    destinationIp: '192.168.1.30',
    protocol: 'HTTPS / 443',
    port: 443,
    bytes: '4.2 MB',
    threat: 'Normal',
    riskScore: 14,
    active: false,
  },
  {
    id: 'NF-4',
    sourceIp: '192.168.1.20',
    destinationIp: '45.33.32.156',
    protocol: 'HTTPS / 443',
    port: 443,
    bytes: '850 MB',
    threat: 'Data Exfiltration',
    riskScore: 96,
    active: true,
  },
  {
    id: 'NF-5',
    sourceIp: '192.168.1.105',
    destinationIp: '192.168.1.0/24',
    protocol: 'TCP SYN',
    port: 80,
    bytes: '58 KB',
    threat: 'Port Scan',
    riskScore: 86,
    active: false,
  },
];

// Benign noise traffic examples for noise control card
export const FILTERED_NOISE_PROTOCOLS = [
  { protocol: 'DHCP', count: 6840, description: 'Dynamic Host Configuration leases', percent: '48.1%' },
  { protocol: 'ARP', count: 4190, description: 'Address Resolution Protocol broadcasts', percent: '29.5%' },
  { protocol: 'DNS Query/Resp', count: 2250, description: 'Whitelisted internal resolver lookups', percent: '15.8%' },
  { protocol: 'Routine ICMP', count: 930, description: 'Telemetry heartbeat & keep-alive pings', percent: '6.6%' },
];
