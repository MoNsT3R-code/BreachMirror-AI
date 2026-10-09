import React, { useState } from 'react';
import { ArrowRight, BarChart2, BookOpen, Flame, Headset, ImageOff, LayoutDashboard, MessagesSquare, ShieldAlert, Zap } from 'lucide-react';
import { Journey } from '../../services/learning-progress';
import { PostureSnapshot } from '../../hooks/use-posture';
import { Dialog } from '../ui/dialog';
import { XYZBackdrop } from '../shell/xyz-backdrop';
import { ProgressRing } from '../learning/progress-ring';

export type HomeTarget = 'copilot' | 'overview' | 'telemetry' | 'playbook' | 'analytics' | 'simulator' | 'support';

interface HomePageProps {
  name: string;
  posture: PostureSnapshot;
  journey: Journey;
  onNavigate: (target: HomeTarget) => void;
}

/** Photos live in public/images/xyz/. Missing files show a labelled placeholder instead of a broken image. */
const BASE = '/images/xyz';
const HERO = { file: 'main.png', alt: 'Glowing padlock shield on a circuit-board background' };
const GALLERY = [
  { file: 'office-gulshan-tower.jpg', alt: 'Illustration of the Gulshan Tower office building at night, with the XYZ sign on top', caption: 'Gulshan Tower office' },
  { file: 'team-leadership.jpg', alt: 'Illustration of five colleagues standing between a Pakistan flag and a United States flag', caption: 'Team photo with Pakistan and U.S. flags' },
  { file: 'event-panel.jpg', alt: 'Illustration of a speaker and a three-person panel on stage in front of a large XYZ screen', caption: 'On stage at an XYZ event' },
  { file: 'team-event.jpg', alt: 'Illustration of the team wearing event badges in front of an XYZ backdrop', caption: 'Team at the XYZ event' },
];

const TILES: Array<{ id: HomeTarget; title: string; text: string; icon: React.ReactNode; key: string; wide?: boolean }> = [
  { id: 'copilot', title: 'Policy Copilot', text: 'Ask the policy anything. Cited, verified answers from a LangGraph RAG agent.', icon: <MessagesSquare className="h-5 w-5" aria-hidden="true" />, key: '6' },
  { id: 'overview', title: 'Dashboard', text: 'Posture score, learning journey and live training widgets.', icon: <LayoutDashboard className="h-5 w-5" aria-hidden="true" />, key: '1' },
  { id: 'telemetry', title: 'Threat activity', text: 'Simulated events, sensors and the live radar.', icon: <ShieldAlert className="h-5 w-5" aria-hidden="true" />, key: '2' },
  { id: 'playbook', title: 'Security guide', text: 'Policy guidance, do and don’t rules and onboarding.', icon: <BookOpen className="h-5 w-5" aria-hidden="true" />, key: '3' },
  { id: 'analytics', title: 'Analytics', text: 'Attack vectors and risk by tenure, with accessible tables.', icon: <BarChart2 className="h-5 w-5" aria-hidden="true" />, key: '4' },
  { id: 'simulator', title: 'Practice', text: 'Decision scenarios with consequences.', icon: <Zap className="h-5 w-5" aria-hidden="true" />, key: '5' },
  { id: 'support', title: 'Security Support', text: 'Not covered by the handbook? The Security Team answers it, and you can follow every request and reply here.', icon: <Headset className="h-5 w-5" aria-hidden="true" />, key: '7', wide: true },
];

const Photo: React.FC<{ file: string; alt: string; className?: string; priority?: boolean }> = ({ file, alt, className = '', priority = false }) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div role="img" aria-label={`${alt} (image not added yet)`} className={`grid place-items-center gap-1 bg-sunken p-4 text-center text-xs text-fg-3 ${className}`}>
        <ImageOff className="h-5 w-5" aria-hidden="true" />
        <span>Add <code className="font-mono">{file}</code> to <code className="font-mono">public/images/xyz/</code></span>
      </div>
    );
  }
  return <img src={`${BASE}/${file}`} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
};

export const HomePage: React.FC<HomePageProps> = ({ name, posture, journey, onNavigate }) => {
  const [zoom, setZoom] = useState<(typeof GALLERY)[number] | null>(null);
  const first = name.trim().split(/\s+/)[0] || 'there';

  return (
    <div className="bm-ds space-y-10">
      <XYZBackdrop />
      {/* Banner: the photo with a glass welcome panel on top, so text never depends on the picture */}
      <section aria-labelledby="home-title" className="relative overflow-hidden rounded-2xl border border-line">
        <Photo file={HERO.file} alt={HERO.alt} className="h-56 w-full sm:h-72 lg:h-80" priority />
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
          <div className="bm-glass-strong flex flex-wrap items-center justify-between gap-4 rounded-xl p-4 sm:p-5">
            <div className="flex min-w-0 items-center gap-4">
              <img src={`${BASE}/logo.png`} alt="XYZ" width={72} height={72} className="hidden h-[72px] w-[72px] shrink-0 rounded-lg object-cover sm:block" />
              <div className="min-w-0">
                <p className="bm-eyebrow">Welcome back, {first}</p>
                <h1 id="home-title" className="bm-h font-display text-3xl font-semibold tracking-tight text-fg sm:text-display">BreachMirror</h1>
                <p className="bm-p mt-1 max-w-xl text-sm text-fg-2">See your security habits reflected. Practice real decisions, learn XYZ policy and earn your certification, with zero blame.</p>
              </div>
            </div>
            <button type="button" className="bm-btn bm-btn-primary" onClick={() => onNavigate('overview')}>
              Open dashboard <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Where you are */}
      <section aria-labelledby="home-progress" className="space-y-3">
        <h2 id="home-progress" className="bm-h font-display text-lg font-semibold text-fg">Where you are</h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          <li className="bm-card flex items-center gap-4 p-4">
            <ProgressRing value={posture.score} label="Security posture" size={64} stroke={7} tone={posture.score >= 80 ? 'safe' : 'accent'} />
            <div>
              <p className="bm-eyebrow">Security posture</p>
              <p className="text-sm font-semibold text-fg">{posture.bandLabel}</p>
            </div>
          </li>
          <li className="bm-card flex items-center gap-4 p-4">
            <ProgressRing value={journey.percent} label="Learning journey" size={64} stroke={7}>
              <span className="text-sm">{journey.completed}/{journey.milestones.length}</span>
            </ProgressRing>
            <div>
              <p className="bm-eyebrow">Learning journey</p>
              <p className="text-sm font-semibold text-fg">{journey.next ? journey.next.label : 'Complete'}</p>
            </div>
          </li>
          <li className="bm-card flex items-center gap-4 p-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-sunken text-fg-2"><Flame className="h-6 w-6" aria-hidden="true" /></span>
            <div>
              <p className="bm-eyebrow">Day streak</p>
              <p className="text-sm font-semibold text-fg">{journey.streak > 0 ? `${journey.streak} ${journey.streak === 1 ? 'day' : 'days'}` : 'Start one today'}</p>
            </div>
          </li>
        </ul>
      </section>

      {/* Explore */}
      <section aria-labelledby="home-explore" className="space-y-3">
        <h2 id="home-explore" className="bm-h font-display text-lg font-semibold text-fg">Explore BreachMirror</h2>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {TILES.map(tile => (
            <li key={tile.id} className={tile.wide ? 'sm:col-span-2 xl:col-span-3' : undefined}>
              <button type="button" onClick={() => onNavigate(tile.id)} className="bm-card bm-magnet flex h-full w-full items-start gap-4 p-4 text-left">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-text">{tile.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-display text-base font-semibold text-fg">{tile.title}</span>
                    <kbd className="bm-kbd" aria-label={`Shortcut ${tile.key}`}>{tile.key}</kbd>
                  </span>
                  <span className="mt-0.5 block text-sm text-fg-3">{tile.text}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* People and places */}
      <section aria-labelledby="home-gallery" className="space-y-3">
        <h2 id="home-gallery" className="bm-h font-display text-lg font-semibold text-fg">Our people and places</h2>
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {GALLERY.map(item => (
            <li key={item.file}>
              <button type="button" onClick={() => setZoom(item)} className="bm-card bm-magnet group block w-full overflow-hidden p-0 text-left" aria-label={`Enlarge photo: ${item.caption}`}>
                <Photo file={item.file} alt={item.alt} className="aspect-[4/3] w-full transition-transform duration-300 group-hover:scale-[1.03]" />
                <span className="block px-3 py-2 text-sm text-fg-2">{item.caption}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <Dialog open={zoom !== null} onClose={() => setZoom(null)} title={zoom?.caption ?? 'Photo'} size="lg">
        {zoom && <Photo file={zoom.file} alt={zoom.alt} className="max-h-[70vh] w-full bg-sunken object-contain" priority />}
      </Dialog>
    </div>
  );
}
