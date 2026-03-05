import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { User, Camera, Activity, ShieldCheck } from 'lucide-react';

interface HeroProps {
  personalCountdown?: { years: number; months: number; days: number } | null;
  globalCountdown?: { years: number; months: number; days: number } | null;
  userInfo?: { nickname: string; occupation: string } | null;
  onOpenUserInput: () => void;
  onShare: () => void;
}

const Hero = ({ personalCountdown, globalCountdown, userInfo, onOpenUserInput, onShare }: HeroProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const liveCountdown = globalCountdown || { years: 14, months: 3, days: 2 };
  const activeCountdown = personalCountdown || liveCountdown;

  const [displayText, setDisplayText] = useState({ years: '00', months: '00', days: '00' });

  useEffect(() => {
    const chars = '0123456789ABCDEF';
    const targets = [
      activeCountdown.years.toString(),
      activeCountdown.months.toString().padStart(2, '0'),
      activeCountdown.days.toString().padStart(2, '0')
    ];
    const keys = ['years', 'months', 'days'] as const;

    keys.forEach((key, index) => {
      let iteration = 0;
      const target = targets[index];
      const interval = setInterval(() => {
        setDisplayText((prev) => ({
          ...prev,
          [key]: target
            .split('')
            .map((_, charIndex) => (charIndex < iteration ? target[charIndex] : chars[Math.floor(Math.random() * chars.length)]))
            .join('')
        }));

        if (iteration >= target.length) clearInterval(interval);
        iteration += 1 / 3;
      }, 45);
    });
  }, [activeCountdown]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
      );
      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: 'power2.out' }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const progress = useMemo(() => {
    const totalDays = 14 * 365 + 3 * 30 + 2;
    const remainingDays = activeCountdown.years * 365 + activeCountdown.months * 30 + activeCountdown.days;
    const ratio = 1 - remainingDays / (totalDays * 2);
    return Math.max(0, Math.min(1, ratio));
  }, [activeCountdown]);

  return (
    <section ref={heroRef} className="relative w-full min-h-[92vh] pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="font-manrope text-xs text-white/70 tracking-[0.22em] uppercase">Live Monitoring</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenUserInput}
              className="flex items-center gap-2 px-4 py-2 border border-white/15 bg-white/[0.03] rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <User className="w-4 h-4 text-white/70" />
              <span className="font-manrope text-xs text-white/80">{userInfo ? userInfo.nickname : 'Profile'}</span>
            </button>
            <button
              onClick={onShare}
              className="flex items-center gap-2 px-4 py-2 border border-white/15 bg-white/[0.03] rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <Camera className="w-4 h-4 text-white/70" />
              <span className="font-manrope text-xs text-white/80">Share</span>
            </button>
          </div>
        </nav>

        <div ref={headlineRef} className="mb-14">
          <p className="font-manrope text-xs text-white/45 tracking-[0.3em] uppercase mb-4">Silicon Specimen</p>
          <h1 className="font-thunder text-6xl md:text-8xl text-white leading-[0.92] max-w-5xl">
            AGI Trajectory
            <span className="block text-oracle-red">Mission Control</span>
          </h1>
          <p className="font-manrope text-white/60 mt-5 max-w-2xl">
            Clean, source-aware monitoring of capability growth, signal intensity, and timeline drift.
          </p>
        </div>

        <div ref={statsRef} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-6 md:p-8">
            <p className="font-manrope text-xs text-white/50 tracking-[0.2em] uppercase mb-4">
              {personalCountdown ? 'Personal Impact Countdown' : 'Global AGI Countdown'}
            </p>
            <div className="flex items-end gap-3 md:gap-6">
              <div>
                <div className="font-thunder text-6xl md:text-8xl text-white">{personalCountdown ? activeCountdown.years : displayText.years}</div>
                <div className="font-manrope text-xs text-white/45 uppercase tracking-wider">Years</div>
              </div>
              <div className="font-thunder text-4xl md:text-5xl text-white/40 mb-3">:</div>
              <div>
                <div className="font-thunder text-6xl md:text-8xl text-white">
                  {personalCountdown ? String(activeCountdown.months).padStart(2, '0') : displayText.months}
                </div>
                <div className="font-manrope text-xs text-white/45 uppercase tracking-wider">Months</div>
              </div>
              <div className="font-thunder text-4xl md:text-5xl text-white/40 mb-3">:</div>
              <div>
                <div className="font-thunder text-6xl md:text-8xl text-white">
                  {personalCountdown ? String(activeCountdown.days).padStart(2, '0') : displayText.days}
                </div>
                <div className="font-manrope text-xs text-white/45 uppercase tracking-wider">Days</div>
              </div>
            </div>

            <div className="mt-7">
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#00a6ff] to-oracle-red rounded-full transition-all duration-700" style={{ width: `${(progress * 100).toFixed(0)}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00a6ff]" />
              <span className="font-manrope text-xs text-white/70 uppercase tracking-wider">Telemetry</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-manrope text-sm text-white/55">Data Pipeline</span>
                <span className="font-mono text-xs text-emerald-400">LIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-manrope text-sm text-white/55">Prediction Engine</span>
                <span className="font-mono text-xs text-emerald-400">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-manrope text-sm text-white/55">Verified Sources</span>
                <span className="font-mono text-xs text-white/80">ENABLED</span>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-manrope text-xs text-white/65">Source-first rendering policy applied</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
