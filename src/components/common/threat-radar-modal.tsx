import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Radio, 
  ShieldAlert, 
  Crosshair, 
  Zap, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Terminal, 
  BookOpen,
  Volume2,
  VolumeX,
  RefreshCw,
  Box,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { soundManager } from '../../services/sound-effects';
import { useAlerts } from '../../context/alert-context';
import { useTheme } from '../../context/theme-context';
import { HANDBOOK_VECTORS, ThreatVectorGuide } from '../../data/handbook-content';
import { InteractiveCard } from './interactive-card';

export interface RadarSampleBreach {
  id: string;
  handbookVectorId: string;
  chapterNumber: number;
  name: string;
  category: string;
  distance: number; // 0.15 to 0.95
  angle: number; // radians
  severity: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  sampleScenario: string;
  sourceIp: string;
  targetCohort: string;
  payloadVector: string;
  blastRadius: string;
  neutralized: boolean;
  elevation: number; // 3D altitude
  lastDetectedTimestamp?: string;
}

// Map the 10 official Stewart Information Security and Usage Policy sections to Radar Blips
export const SAMPLE_HANDBOOK_RADAR_BREACHES: RadarSampleBreach[] = [
  {
    id: 'radar-sample-1',
    handbookVectorId: 'stewart-sec-05',
    chapterNumber: 5,
    name: 'Public AI PII Ingestion',
    category: 'AI & Machine Learning',
    distance: 0.38,
    angle: 0.35, // ~20 deg
    severity: 'CRITICAL',
    sampleScenario: 'Sample Breach: Internee pasted raw customer escrow file and SSNs into public ChatGPT for summary drafting.',
    sourceIp: '185.220.101.45 [Public LLM Cloud]',
    targetCohort: 'Engineering & Operations Staff',
    payloadVector: 'Tokenized prompts entering public LLM retention firehose outside Stewart VPC boundary',
    blastRadius: 'Confidential customer PII exposure and breach of Stewart Section 5 AI mandate',
    neutralized: false,
    elevation: 28,
  },
  {
    id: 'radar-sample-2',
    handbookVectorId: 'stewart-sec-02',
    chapterNumber: 2,
    name: 'UnApproved Cloud Storage Sync',
    category: 'Information Protection',
    distance: 0.62,
    angle: 0.98, // ~56 deg
    severity: 'CRITICAL',
    sampleScenario: 'Sample Breach: Employee synchronized Stewart transaction records to personal Google Drive and attempted to disable local EDR.',
    sourceIp: '194.26.29.112 [Consumer Cloud Sync]',
    targetCohort: 'Remote Workers & Contractors',
    payloadVector: 'Personal cloud synchronization bypassing Stewart M365 DLP and legal hold controls',
    blastRadius: 'Loss of regulatory data governance and immediate termination liability under Section 2',
    neutralized: false,
    elevation: 36,
  },
  {
    id: 'radar-sample-3',
    handbookVectorId: 'stewart-sec-03',
    chapterNumber: 3,
    name: 'AiTM Phishing & MFA Bypass',
    category: 'Authentication & Access',
    distance: 0.44,
    angle: 1.62, // ~93 deg
    severity: 'CRITICAL',
    sampleScenario: 'Sample Breach: Reverse-proxy fake login harvested SSO credentials; employee Approved an unsolicited MFA prompt at night.',
    sourceIp: 'login-corp-verify.security-auth.co',
    targetCohort: 'Contractors & Remote Staff',
    payloadVector: 'Adversary-in-the-Middle reverse proxy harvesting corporate SSO session cookies',
    blastRadius: 'Enterprise cloud account takeover and violation of phish-resistant MFA standard',
    neutralized: false,
    elevation: 32,
  },
  {
    id: 'radar-sample-4',
    handbookVectorId: 'stewart-sec-08',
    chapterNumber: 8,
    name: 'Shadow IT & WhatsApp Comms',
    category: 'Cloud & Applications',
    distance: 0.72,
    angle: 2.25, // ~129 deg
    severity: 'HIGH',
    sampleScenario: 'Sample Breach: Project group created an unApproved consumer WhatsApp chat to transfer closing documents and customer files.',
    sourceIp: 'Consumer Messaging Gateway',
    targetCohort: 'Deal Operations & Escrow Teams',
    payloadVector: 'Shadow IT communication channels bypassing corporate archive and compliance retention',
    blastRadius: 'Severe spoliation of legal evidence and violation of Section 8 cloud management standards',
    neutralized: false,
    elevation: 20,
  },
  {
    id: 'radar-sample-5',
    handbookVectorId: 'stewart-sec-06',
    chapterNumber: 6,
    name: 'Lost Laptop Unreported Past 1h',
    category: 'Device Management',
    distance: 0.85,
    angle: 2.88, // ~165 deg
    severity: 'HIGH',
    sampleScenario: 'Sample Breach: Company laptop left in vehicle was stolen; employee delayed reporting for 18 hours, missing the 1-hour remote wipe window.',
    sourceIp: 'Physical Endpoint GPS Offline',
    targetCohort: 'Field Representatives & Traveling Staff',
    payloadVector: 'Physical theft with delayed notification preventing immediate remote disk erasure',
    blastRadius: 'Cached corporate credentials exposed; incident escalation to CISO and Legal',
    neutralized: false,
    elevation: 24,
  },
  {
    id: 'radar-sample-6',
    handbookVectorId: 'stewart-sec-01',
    chapterNumber: 1,
    name: 'Credential Re-use on External Site',
    category: 'Information Classification',
    distance: 0.52,
    angle: 3.52, // ~202 deg
    severity: 'HIGH',
    sampleScenario: 'Sample Breach: Associate registered on an external discount site using Stewart work email and SSO password; external site was breached.',
    sourceIp: 'Registry Mirror: credential-dump.net',
    targetCohort: 'New Joiners & Trainees',
    payloadVector: 'Credential stuffing attack leveraging reused corporate passwords across external sites',
    blastRadius: 'Stewart perimeter credential stuffing requiring immediate corporate-wide password revocation',
    neutralized: false,
    elevation: 22,
  },
  {
    id: 'radar-sample-7',
    handbookVectorId: 'stewart-sec-07',
    chapterNumber: 7,
    name: 'Unencrypted Wi-Fi Direct Access',
    category: 'Network & Remote Access',
    distance: 0.65,
    angle: 4.15, // ~238 deg
    severity: 'HIGH',
    sampleScenario: 'Sample Breach: Employee connected to airport Wi-Fi without Stewart VPN, exposing internal Application session tokens to local packet sniffing.',
    sourceIp: 'Rogue AP: Airport_Free_WiFi_Official',
    targetCohort: 'Traveling Associates',
    payloadVector: 'Evil Twin wireless access point intercepting unencrypted DNS and internal web sessions',
    blastRadius: 'Cleartext token theft and lateral intranet infiltration bypassing network controls',
    neutralized: false,
    elevation: 26,
  },
  {
    id: 'radar-sample-8',
    handbookVectorId: 'stewart-sec-09',
    chapterNumber: 9,
    name: 'Concealed Malware Incident',
    category: 'Incident Reporting',
    distance: 0.28,
    angle: 4.78, // ~274 deg
    severity: 'CRITICAL',
    sampleScenario: 'Sample Breach: Employee opened a malicious macro attachment and attempted self-remediation instead of reporting to itsecurity@stewart.com within 1 hour.',
    sourceIp: 'External C2 Server: 45.33.32.156',
    targetCohort: 'Corporate Operations',
    payloadVector: 'Delayed notification allowing adversary C2 agent to establish lateral persistence across Active Directory',
    blastRadius: 'Loss of mitigating good-faith factors under Section 10; disciplinary escalation',
    neutralized: false,
    elevation: 34,
  },
  {
    id: 'radar-sample-9',
    handbookVectorId: 'stewart-sec-04',
    chapterNumber: 4,
    name: 'Post-Separation Access Attempt',
    category: 'Ownership & Privacy',
    distance: 0.76,
    angle: 5.42, // ~310 deg
    severity: 'HIGH',
    sampleScenario: 'Sample Breach: Former contractor attempted to log in to Stewart OneDrive using cached tokens after contract conclusion.',
    sourceIp: 'Residential ISP Proxy',
    targetCohort: 'Terminated Contractors & Former Employees',
    payloadVector: 'Unauthorized post-termination access to Stewart intellectual property',
    blastRadius: 'Referral to Stewart Legal for civil and criminal prosecution under Section 4',
    neutralized: false,
    elevation: 18,
  },
  {
    id: 'radar-sample-10',
    handbookVectorId: 'stewart-sec-10',
    chapterNumber: 10,
    name: 'Removable Media & DLP Bypass',
    category: 'Enforcement & Discipline',
    distance: 0.32,
    angle: 6.05, // ~347 deg
    severity: 'CRITICAL',
    sampleScenario: 'Sample Breach: Unauthorized USB drive plugged into workstation attempting to transfer transaction files, violating Section 10 removable media ban.',
    sourceIp: 'USB Hardware Bus Endpoint',
    targetCohort: 'Privileged Insiders',
    payloadVector: 'Unencrypted physical USB flash drive insertion bypassing perimeter DLP policy',
    blastRadius: 'Critical Violation: Workstation lockdown, formal investigation, and disciplinary escalation',
    neutralized: false,
    elevation: 35,
  },
];

interface ThreatRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHandbookVector?: (vectorId: string) => void;
  initialBreachId?: string;
}

export const ThreatRadarModal: React.FC<ThreatRadarModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenHandbookVector,
  initialBreachId
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [blips, setBlips] = useState<RadarSampleBreach[]>(SAMPLE_HANDBOOK_RADAR_BREACHES);
  const [selectedBlipId, setSelectedBlipId] = useState<string>('radar-sample-1');
  const [counterLog, setCounterLog] = useState<string[]>([]);
  const [isCountering, setIsCountering] = useState<boolean>(false);
  const [viewMode3D, setViewMode3D] = useState<boolean>(true); // 3D Isometric vs 2D Top-Down
  const [latestDetectedBreach, setLatestDetectedBreach] = useState<RadarSampleBreach | null>(null);
  const [pitchAngle, setPitchAngle] = useState<number>(0.55); // 3D isometric pitch
  const [rotOffset, setRotOffset] = useState<number>(0);
  const { deployCountermeasure, isVengeanceMode, soundEnabled, toggleSound } = useAlerts();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  const selectedBlip = blips.find(b => b.id === selectedBlipId) || blips[0];
  const matchedHandbookVector = HANDBOOK_VECTORS.find(v => v.id === selectedBlip?.handbookVectorId);

  // Set initial selected blip if requested
  useEffect(() => {
    if (initialBreachId) {
      const match = blips.find(b => b.id === initialBreachId || b.handbookVectorId === initialBreachId);
      if (match) {
        setSelectedBlipId(match.id);
      }
    }
  }, [initialBreachId, blips]);

  // Radar sweep animation loop with 3D Holographic Perspective & Live Sample Breach Detection
  useEffect(() => {
    if (!isOpen) return;

    let sweepAngle = 0;
    let animationFrameId: number;
    let lastDetectedId = '';

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2 + (viewMode3D ? 20 : 0);
      const baseRadius = Math.min(centerX, centerY) - 28;

      // 3D Perspective aspect squash
      const ySquash = viewMode3D ? Math.cos(pitchAngle) : 1;

      // Clear canvas with deep aesthetic fade
      if (isLight) {
        ctx.fillStyle = 'rgba(248, 250, 252, 0.35)';
      } else {
        ctx.fillStyle = isVengeanceMode ? 'rgba(8, 2, 14, 0.28)' : 'rgba(2, 6, 23, 0.28)';
      }
      ctx.fillRect(0, 0, width, height);

      // Draw 3D Radial Grid Plane (Floating Holographic Rings)
      const ringDistances = [0.25, 0.5, 0.75, 1.0];
      const ringLabels = [
        'RING 1: CORE VAULT',
        'RING 2: VPC PRIVATE',
        'RING 3: DMZ INGRESS',
        'RING 4: PERIMETER EDGE',
      ];

      ringDistances.forEach((d, idx) => {
        ctx.save();
        ctx.beginPath();

        // If in 3D mode, draw true isometric elliptical projection
        ctx.ellipse(centerX, centerY, baseRadius * d, baseRadius * d * ySquash, 0, 0, Math.PI * 2);

        if (isLight) {
          ctx.strokeStyle = idx === ringDistances.length - 1 ? 'rgba(2, 132, 199, 0.45)' : 'rgba(203, 213, 225, 0.8)';
          ctx.lineWidth = idx === ringDistances.length - 1 ? 1.5 : 1;
        } else {
          ctx.strokeStyle = isVengeanceMode 
            ? `rgba(244, 63, 94, ${0.18 + idx * 0.08})` 
            : `rgba(0, 242, 254, ${0.15 + idx * 0.08})`;
          ctx.lineWidth = idx === ringDistances.length - 1 ? 1.5 : 1;
        }
        ctx.stroke();

        // Label on ring
        ctx.fillStyle = isLight 
          ? '#0284c7' 
          : isVengeanceMode ? '#fda4af' : '#67e8f9';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(ringLabels[idx], centerX + 8, centerY - (baseRadius * d * ySquash) + 11);
        ctx.restore();
      });

      // Crosshair Axes (Projected in 3D)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX - baseRadius, centerY);
      ctx.lineTo(centerX + baseRadius, centerY);
      ctx.moveTo(centerX, centerY - baseRadius * ySquash);
      ctx.lineTo(centerX, centerY + baseRadius * ySquash);
      ctx.strokeStyle = isLight 
        ? 'rgba(148, 163, 184, 0.4)' 
        : isVengeanceMode ? 'rgba(244, 63, 94, 0.2)' : 'rgba(6, 182, 212, 0.2)';
      ctx.stroke();
      ctx.restore();

      // Sweep Beam (Rotating sector with 3D elliptical transform)
      sweepAngle += isVengeanceMode ? 0.04 : 0.024;
      if (sweepAngle > Math.PI * 2) sweepAngle -= Math.PI * 2;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);

      // Sweep arc in 3D projection
      const sweepSteps = 16;
      const sweepSpread = 0.4;
      for (let s = 0; s <= sweepSteps; s++) {
        const a = sweepAngle - sweepSpread + (s / sweepSteps) * sweepSpread;
        const x = centerX + Math.cos(a) * baseRadius;
        const y = centerY + Math.sin(a) * (baseRadius * ySquash);
        ctx.lineTo(x, y);
      }
      ctx.closePath();

      const sweepGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius);
      if (isLight) {
        sweepGradient.addColorStop(0, 'rgba(2, 132, 199, 0.45)');
        sweepGradient.addColorStop(0.7, 'rgba(2, 132, 199, 0.15)');
        sweepGradient.addColorStop(1, 'rgba(2, 132, 199, 0)');
      } else if (isVengeanceMode) {
        sweepGradient.addColorStop(0, 'rgba(255, 42, 109, 0.55)');
        sweepGradient.addColorStop(0.6, 'rgba(168, 85, 247, 0.25)');
        sweepGradient.addColorStop(1, 'rgba(244, 63, 94, 0)');
      } else {
        sweepGradient.addColorStop(0, 'rgba(0, 242, 254, 0.55)');
        sweepGradient.addColorStop(0.6, 'rgba(16, 243, 150, 0.2)');
        sweepGradient.addColorStop(1, 'rgba(0, 242, 254, 0)');
      }
      ctx.fillStyle = sweepGradient;
      ctx.fill();

      // Sharp Leading Edge
      const leadX = centerX + Math.cos(sweepAngle) * baseRadius;
      const leadY = centerY + Math.sin(sweepAngle) * (baseRadius * ySquash);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(leadX, leadY);
      ctx.strokeStyle = isLight 
        ? '#0284c7' 
        : isVengeanceMode ? '#ff0055' : '#00f2fe';
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.restore();

      // -------------------------------------------------------------
      // Live Sample Breach Detection Check (Trigger when sweep crosses blip)
      // -------------------------------------------------------------
      blips.forEach(b => {
        let angleDiff = Math.abs(b.angle - sweepAngle);
        if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;

        // If sweep beam is directly over the blip
        if (angleDiff < 0.08 && !b.neutralized) {
          if (lastDetectedId !== b.id) {
            lastDetectedId = b.id;
            setLatestDetectedBreach(b);
            if (soundEnabled) {
              soundManager.playBlip(b.severity === 'CRITICAL' ? 880 : 640);
            }
          }
        }
      });

      // -------------------------------------------------------------
      // Render 3D Sample Breach Blips & Holographic Stems
      // -------------------------------------------------------------
      blips.forEach(b => {
        // Compute base plane position on radar floor
        const floorX = centerX + Math.cos(b.angle) * (baseRadius * b.distance);
        const floorY = centerY + Math.sin(b.angle) * (baseRadius * b.distance * ySquash);

        // In 3D view, threat blip hovers at an elevated altitude above floor
        const blipElev = viewMode3D ? b.elevation : 0;
        const blipX = floorX;
        const blipY = floorY - blipElev;

        // Draw 3D elevation vertical stem / laser beacon
        if (viewMode3D && blipElev > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(floorX, floorY);
          ctx.lineTo(blipX, blipY);
          ctx.strokeStyle = b.neutralized 
            ? 'rgba(16, 185, 129, 0.4)' 
            : b.severity === 'CRITICAL'
            ? 'rgba(244, 63, 94, 0.5)'
            : 'rgba(245, 158, 11, 0.5)';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([2, 2]);
          ctx.stroke();

          // Base footprint on radar floor
          ctx.beginPath();
          ctx.ellipse(floorX, floorY, 5, 5 * ySquash, 0, 0, Math.PI * 2);
          ctx.fillStyle = b.neutralized 
            ? 'rgba(16, 185, 129, 0.25)' 
            : 'rgba(244, 63, 94, 0.25)';
          ctx.fill();
          ctx.restore();
        }

        // Blip head
        ctx.save();
        ctx.beginPath();
        ctx.arc(blipX, blipY, b.neutralized ? 4.5 : 7, 0, Math.PI * 2);

        if (b.neutralized) {
          ctx.fillStyle = '#10b981';
          ctx.fill();
        } else {
          ctx.fillStyle = b.severity === 'CRITICAL' 
            ? '#f43f5e' 
            : b.severity === 'HIGH' 
            ? '#f59e0b' 
            : '#0284c7';
          ctx.fill();

          // Pulsing halo for active breach
          ctx.beginPath();
          ctx.arc(blipX, blipY, 14, 0, Math.PI * 2);
          ctx.strokeStyle = b.severity === 'CRITICAL' 
            ? 'rgba(244, 63, 94, 0.45)' 
            : 'rgba(245, 158, 11, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Selection Crosshair & Indicator
        if (b.id === selectedBlipId) {
          ctx.strokeStyle = isLight ? '#0284c7' : '#00f2fe';
          ctx.lineWidth = 2;
          ctx.strokeRect(blipX - 11, blipY - 11, 22, 22);

          // Diagonal corner marks
          ctx.beginPath();
          ctx.moveTo(blipX - 16, blipY);
          ctx.lineTo(blipX + 16, blipY);
          ctx.moveTo(blipX, blipY - 16);
          ctx.lineTo(blipX, blipY + 16);
          ctx.strokeStyle = isLight ? '#0369a1' : '#00f2fe';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Floating Callout HUD Card (safely clamped within canvas boundaries)
          const hudW = 164;
          const hudH = 38;
          let hudX = blipX + 16;
          let hudY = blipY - hudH - 8;
          if (hudX + hudW > width - 10) hudX = blipX - hudW - 16;
          if (hudX < 10) hudX = 10;
          if (hudY < 10) hudY = blipY + 16;
          if (hudY + hudH > height - 10) hudY = height - hudH - 10;

          // HUD backdrop
          ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.96)' : 'rgba(10, 15, 30, 0.94)';
          ctx.fillRect(hudX, hudY, hudW, hudH);
          ctx.strokeStyle = isLight ? '#0284c7' : '#00f2fe';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(hudX, hudY, hudW, hudH);

          // HUD Header
          ctx.fillStyle = isLight ? '#0369a1' : '#38bdf8';
          ctx.font = 'bold 8px monospace';
          ctx.fillText(`LOCKED • CHAPTER ${b.chapterNumber}`, hudX + 6, hudY + 11);

          // HUD Name
          ctx.fillStyle = isLight ? '#0f172a' : '#ffffff';
          ctx.font = 'bold 9px sans-serif';
          const truncatedName = b.name.length > 22 ? b.name.substring(0, 20) + '...' : b.name;
          ctx.fillText(truncatedName, hudX + 6, hudY + 23);

          // HUD Status
          ctx.fillStyle = b.neutralized ? (isLight ? '#059669' : '#34d399') : (isLight ? '#e11d48' : '#f43f5e');
          ctx.font = 'bold 8px monospace';
          ctx.fillText(b.neutralized ? 'STATUS: NEUTRALIZED' : `STATUS: ${b.severity} ALERT`, hudX + 6, hudY + 33);
        }

        // Tactical Blip Tag (Compact and crisp, no overlap)
        const tagText = `CH.${b.chapterNumber}`;
        ctx.font = 'bold 9px monospace';
        const tagWidth = ctx.measureText(tagText).width + 6;
        
        ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(blipX + 10, blipY - 7, tagWidth, 14);
        ctx.strokeStyle = isLight 
          ? (b.neutralized ? '#10b981' : b.severity === 'CRITICAL' ? '#f43f5e' : '#0284c7')
          : (b.neutralized ? '#34d399' : b.severity === 'CRITICAL' ? '#fb7185' : '#38bdf8');
        ctx.lineWidth = 1;
        ctx.strokeRect(blipX + 10, blipY - 7, tagWidth, 14);

        ctx.fillStyle = isLight 
          ? (b.neutralized ? '#047857' : '#0f172a') 
          : (b.neutralized ? '#a7f3d0' : '#f8fafc');
        ctx.fillText(tagText, blipX + 13, blipY + 3.5);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, blips, selectedBlipId, isVengeanceMode, viewMode3D, pitchAngle, soundEnabled, isLight]);

  if (!isOpen) return null;

  // Handle canvas click to select blip
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + (viewMode3D ? 20 : 0);
    const baseRadius = Math.min(centerX, centerY) - 28;
    const ySquash = viewMode3D ? Math.cos(pitchAngle) : 1;

    let closestId: string | null = null;
    let minDistance = 35;

    blips.forEach(b => {
      const floorX = centerX + Math.cos(b.angle) * (baseRadius * b.distance);
      const floorY = centerY + Math.sin(b.angle) * (baseRadius * b.distance * ySquash);
      const blipElev = viewMode3D ? b.elevation : 0;
      const blipX = floorX;
      const blipY = floorY - blipElev;

      const dist = Math.hypot(clickX - blipX, clickY - blipY);
      if (dist < minDistance) {
        minDistance = dist;
        closestId = b.id;
      }
    });

    if (closestId) {
      setSelectedBlipId(closestId);
      soundManager.playTargetLock();
    }
  };

  // Launch zero-blame countermeasure
  const handleLaunchCountermeasure = (actionType: 'HONEYTOKEN' | 'BLACKHOLE' | 'SANDBOX') => {
    if (!selectedBlip || selectedBlip.neutralized || isCountering) return;

    setIsCountering(true);
    deployCountermeasure(selectedBlip.name);

    const timestamp = new Date().toLocaleTimeString();
    let actionDesc = '';
    if (actionType === 'HONEYTOKEN') {
      actionDesc = `[${timestamp}] DEPLOYED CANARY HONEYTOKEN: Injected synthetic fake tokens into ${selectedBlip.sourceIp}. Adversary exfiltrating decoy data.`;
    } else if (actionType === 'BLACKHOLE') {
      actionDesc = `[${timestamp}] ZERO-BLAME ISOLATION: BGP Blackhole invoked for endpoint ${selectedBlip.sourceIp}. Workstation session revoked with 0 penalty.`;
    } else {
      actionDesc = `[${timestamp}] FORENSIC MIRROR SANDBOX: Attack packets rerouted into Ephemeral Docker Quarantine. Blast radius reduced to 0.`;
    }

    setCounterLog(prev => [actionDesc, ...prev]);

    setTimeout(() => {
      setBlips(prev =>
        prev.map(b => (b.id === selectedBlip.id ? { ...b, neutralized: true } : b))
      );
      setIsCountering(false);
      soundManager.playSuccess();
    }, 450);
  };

  const handleResetRadar = () => {
    setBlips(SAMPLE_HANDBOOK_RADAR_BREACHES);
    setSelectedBlipId('radar-sample-1');
    soundManager.playBlip(600);
  };

  const handleSelectSampleBreach = (breach: RadarSampleBreach) => {
    setSelectedBlipId(breach.id);
    soundManager.playTargetLock();
  };

  const handleOpenHandbookForSelected = () => {
    if (onOpenHandbookVector && selectedBlip) {
      onOpenHandbookVector(selectedBlip.handbookVectorId);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="vengeance-glass border border-white/10 dark:border-white/10 border-slate-300 rounded-3xl w-full max-w-5xl bg-slate-950/95 dark:bg-slate-950/95 light:bg-white text-slate-900 dark:text-white overflow-hidden shadow-2xl flex flex-col max-h-[94vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 dark:border-white/10 border-slate-200 flex items-center justify-between bg-slate-900/90 dark:bg-slate-900/90 light:bg-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)]">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display uppercase tracking-wider">
                  Security handbook radar
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 font-bold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-ping" />
                  Sample alerts active
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                A visual guide to sample security events
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 3D vs 2D Perspective Toggle */}
            <button
              onClick={() => setViewMode3D(prev => !prev)}
              title="Switch between 3D and 2D views"
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode3D
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-200 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{viewMode3D ? '3D Isometric' : '2D Plan'}</span>
            </button>

            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute radar sounds' : 'Turn on radar sounds'}
              className="p-2 rounded-xl bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-500 dark:text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            <button
              onClick={handleResetRadar}
              title="Reset sample events"
              className="p-2 rounded-xl bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Breach Detection Warning Ribbon */}
        {latestDetectedBreach && !latestDetectedBreach.neutralized && (
          <div className="bg-rose-500/15 border-b border-rose-500/40 px-6 py-2.5 flex items-center justify-between text-xs font-mono animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="font-bold text-slate-900 dark:text-white">Sample event detected:</span>
              <span className="text-amber-700 dark:text-amber-300 font-bold">{latestDetectedBreach.name}</span>
              <span className="text-slate-600 dark:text-slate-400">({latestDetectedBreach.category})</span>
            </div>
            <button
              onClick={() => {
                setSelectedBlipId(latestDetectedBreach.id);
                soundManager.playTargetLock();
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold text-[11px] cursor-pointer inline-flex items-center gap-1 transition-all"
            >
              <Crosshair className="w-3 h-3" /> Focus Target
            </button>
          </div>
        )}

        {/* Fast Handbook Sample Breach Selector Bar */}
        <div className="px-6 py-2 border-b border-white/10 dark:border-white/10 border-slate-200 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 overflow-x-auto flex items-center gap-2 scrollbar-none">
              <span className="text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-400 tracking-wider whitespace-nowrap flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Sample events:
          </span>
          {blips.map(b => (
            <button
              key={b.id}
              onClick={() => handleSelectSampleBreach(b)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedBlipId === b.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : b.neutralized
                  ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10'
              }`}
            >
              <span className="text-[10px] opacity-75">#{b.chapterNumber}</span>
              <span>{b.name}</span>
              {b.neutralized && <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
            </button>
          ))}
        </div>

        {/* Content Body: Radar Canvas on Left, Target Dossier & Actions on Right */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 overflow-y-auto">
          {/* 3D Radar Canvas Panel */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-white/10 dark:border-white/10 border-slate-200 relative group">
            <canvas
              ref={canvasRef}
              width={540}
              height={470}
              onClick={handleCanvasClick}
              className="w-full max-w-[500px] h-auto cursor-crosshair rounded-full border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]"
            />
            
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pointer-events-none">
              <span className="flex items-center gap-1.5 text-cyan-700 dark:text-cyan-400 font-bold">
                <Crosshair className="w-3.5 h-3.5 animate-pulse" /> Select a dot to see details
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                {blips.filter(b => !b.neutralized).length} sample alerts active
              </span>
            </div>
          </div>

          {/* Tactical Target Dossier & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {selectedBlip ? (
              <div className="space-y-4">
                {/* Dossier Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-50 border border-white/10 dark:border-white/10 border-slate-200 space-y-3 shadow-xl text-slate-900 dark:text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-bold">
                      Handbook chapter #{selectedBlip.chapterNumber}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      selectedBlip.neutralized 
                        ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40' 
                        : selectedBlip.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-500/40 animate-pulse'
                        : 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40'
                    }`}>
                      {selectedBlip.neutralized ? 'Resolved' : `${selectedBlip.severity} priority`}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                    {selectedBlip.name}
                  </h3>

                  {/* Sample Breach Scenario Banner */}
                  <div className="p-3 rounded-xl bg-cyan-950/40 dark:bg-cyan-950/40 light:bg-cyan-50 border border-cyan-500/30 text-xs font-mono text-cyan-950 dark:text-cyan-200">
                    <span className="text-cyan-700 dark:text-cyan-400 font-bold block text-[10px] uppercase mb-1">
                      Sample workplace scenario:
                    </span>
                    {selectedBlip.sampleScenario}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-black/40 dark:bg-black/40 light:bg-white border border-white/5 dark:border-white/5 border-slate-200">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Category</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedBlip.category}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 dark:bg-black/40 light:bg-white border border-white/5 dark:border-white/5 border-slate-200">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Who may be affected</span>
                      <span className="text-amber-700 dark:text-amber-300 truncate block font-semibold">{selectedBlip.targetCohort}</span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 font-mono">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] block">How it could happen</span>
                    <p className="text-slate-700 dark:text-slate-300">{selectedBlip.payloadVector}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-500/10 dark:bg-rose-500/10 light:bg-rose-50 border border-rose-500/30 text-xs font-mono text-rose-950 dark:text-rose-200">
                    <span className="text-rose-700 dark:text-rose-400 font-bold block text-[10px]">Possible impact</span>
                    {selectedBlip.blastRadius}
                  </div>

                  {/* Direct Link to Handbook */}
                  {onOpenHandbookVector && (
                    <button
                      onClick={handleOpenHandbookForSelected}
                      className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-[1.01]"
                    >
                      <BookOpen className="w-4 h-4 text-slate-950" />
                      <span>Review prevention guidance</span>
                      <ArrowRight className="w-4 h-4 ml-auto text-slate-950" />
                    </button>
                  )}
                </div>

                {/* Countermeasures Section */}
                {!selectedBlip.neutralized ? (
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" /> Choose a response
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => handleLaunchCountermeasure('HONEYTOKEN')}
                        disabled={isCountering}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs font-bold font-mono flex items-center justify-between cursor-pointer transition-all active:scale-98"
                      >
                        <span className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Add a harmless decoy
                        </span>
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-normal">Decoy</span>
                      </button>

                      <button
                        onClick={() => handleLaunchCountermeasure('BLACKHOLE')}
                        disabled={isCountering}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600/20 to-purple-600/20 hover:from-rose-600/30 hover:to-purple-600/30 border border-rose-500/40 text-rose-800 dark:text-rose-300 text-xs font-bold font-mono flex items-center justify-between cursor-pointer transition-all active:scale-98"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" /> Block the source and end the session
                        </span>
                        <span className="text-[10px] text-rose-700 dark:text-rose-400 font-normal">Block</span>
                      </button>

                      <button
                        onClick={() => handleLaunchCountermeasure('SANDBOX')}
                        disabled={isCountering}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/40 text-cyan-800 dark:text-cyan-300 text-xs font-bold font-mono flex items-center justify-between cursor-pointer transition-all active:scale-98"
                      >
                        <span className="flex items-center gap-2">
                          <Crosshair className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Move it to the practice area
                        </span>
                        <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-normal">Review</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mx-auto" />
                    <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 font-display">
                      Sample event resolved
                    </h4>
                    <p className="text-xs text-emerald-900/80 dark:text-emerald-200/80 font-mono">
                      This sample event is contained. In a real incident, reporting quickly helps the team respond.
                    </p>
                  </div>
                )}
              </div>
            ) : null}

            {/* Tactical Log */}
            <div className="p-3 rounded-xl bg-black/60 dark:bg-black/60 light:bg-slate-100 border border-white/5 dark:border-white/5 border-slate-200 space-y-1.5 max-h-[130px] overflow-y-auto text-[11px] font-mono text-slate-700 dark:text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-300 font-bold border-b border-white/5 dark:border-white/5 border-slate-200 pb-1">
                <Terminal className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Radar activity log</span>
              </div>
              {counterLog.length === 0 ? (
                <p className="text-slate-500 italic">Scanning sample events from the handbook.</p>
              ) : (
                counterLog.map((log, idx) => (
                  <div key={idx} className="text-cyan-800 dark:text-cyan-300/90 leading-tight">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
