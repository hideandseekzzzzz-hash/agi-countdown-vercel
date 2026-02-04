import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { User, Camera } from 'lucide-react';

interface HeroProps {
  personalCountdown?: { years: number; months: number; days: number } | null;
  userInfo?: { nickname: string; occupation: string } | null;
  onOpenUserInput: () => void;
  onShare: () => void;
}

const Hero = ({ personalCountdown, userInfo, onOpenUserInput, onShare }: HeroProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const sloganRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const foreheadRef = useRef<HTMLDivElement>(null);
  
  const [countdown] = useState({ years: 14, months: 3, days: 2 });
  const [displayText, setDisplayText] = useState({ years: '00', months: '00', days: '00' });
  const [eyesOpen, setEyesOpen] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(0.2);

  // Calculate progress (0-1) based on total time
  const totalDays = 14 * 365 + 3 * 30 + 2;
  const remainingDays = countdown.years * 365 + countdown.months * 30 + countdown.days;
  const progress = 1 - (remainingDays / (totalDays * 2)); // Multiply by 2 to show more dramatic change

  // Eye opening animation based on progress
  useEffect(() => {
    // Eyes start closed, gradually open as countdown progresses
    const eyeOpenAmount = Math.min(progress * 1.5, 1); // 0 to 1
    setEyesOpen(eyeOpenAmount > 0.3);
    
    // Light intensity increases as countdown approaches
    const intensity = 0.2 + progress * 0.8; // 0.2 to 1.0
    setLightIntensity(intensity);

    // Animate eyes
    if (leftEyeRef.current && rightEyeRef.current) {
      gsap.to([leftEyeRef.current, rightEyeRef.current], {
        opacity: eyeOpenAmount,
        scaleY: eyeOpenAmount,
        duration: 2,
        ease: 'power2.out'
      });
    }

    // Animate forehead light
    if (foreheadRef.current) {
      gsap.to(foreheadRef.current, {
        opacity: intensity,
        boxShadow: `0 0 ${30 + progress * 50}px ${10 + progress * 20}px rgba(224, 48, 0, ${intensity})`,
        duration: 1.5,
        ease: 'power2.out'
      });
    }
  }, [progress]);

  // Glitch text effect for countdown
  useEffect(() => {
    const chars = '0123456789ABCDEF';
    const targets = [countdown.years.toString(), countdown.months.toString().padStart(2, '0'), countdown.days.toString().padStart(2, '0')];
    const keys = ['years', 'months', 'days'] as const;
    
    keys.forEach((key, index) => {
      let iteration = 0;
      const target = targets[index];
      
      const interval = setInterval(() => {
        setDisplayText(prev => ({
          ...prev,
          [key]: target.split('').map((_, charIndex) => {
            if (charIndex < iteration) return target[charIndex];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('')
        }));
        
        if (iteration >= target.length) {
          clearInterval(interval);
        }
        iteration += 1/3;
      }, 50);
    });
  }, [countdown]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background image reveal
      gsap.fromTo(imageRef.current,
        { scale: 1.2, filter: 'blur(20px)' },
        { scale: 1, filter: 'blur(0px)', duration: 1.8, ease: 'power3.out' }
      );

      // Countdown glitch reveal
      gsap.fromTo(countdownRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: 'steps(10)' }
      );

      // Slogan character reveal
      gsap.fromTo(sloganRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.0, delay: 0.8, ease: 'power3.out' }
      );

      // Navigation slide down
      gsap.fromTo(navRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1.0, ease: 'power3.out' }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;
      
      gsap.to(imageRef.current, {
        x: xPercent * -20,
        y: yPercent * -20,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const navItems = [
    { label: '数据', href: '#metrics' },
    { label: '预言', href: '#prophecies' },
    { label: '关于', href: '#about' },
  ];

  // Use personal countdown if available
  const displayCountdown = personalCountdown || countdown;

  return (
    <section 
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* Background Image */}
      <div 
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
        style={{ transform: 'scale(1.1)' }}
      >
        <img 
          src="/hero-robot.jpg" 
          alt="AI Oracle"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        <div 
          className="absolute inset-0 mix-blend-overlay transition-opacity duration-1000"
          style={{ 
            backgroundColor: `rgba(224, 48, 0, ${lightIntensity * 0.15})`,
          }}
        />
      </div>

      {/* Animated Eye Lights */}
      <div 
        ref={leftEyeRef}
        className="absolute top-[42%] left-[35%] w-16 h-8 pointer-events-none"
        style={{ 
          opacity: 0,
          transform: 'scaleY(0)',
          transformOrigin: 'center'
        }}
      >
        <div 
          className="w-full h-full rounded-full transition-all duration-1000"
          style={{
            background: `radial-gradient(ellipse at center, rgba(224, 48, 0, ${lightIntensity}) 0%, rgba(224, 48, 0, ${lightIntensity * 0.3}) 40%, transparent 70%)`,
            boxShadow: `0 0 ${20 + progress * 30}px ${5 + progress * 15}px rgba(224, 48, 0, ${lightIntensity * 0.8})`,
            filter: `blur(${2 - progress}px)`,
          }}
        />
      </div>

      <div 
        ref={rightEyeRef}
        className="absolute top-[42%] right-[35%] w-16 h-8 pointer-events-none"
        style={{ 
          opacity: 0,
          transform: 'scaleY(0)',
          transformOrigin: 'center'
        }}
      >
        <div 
          className="w-full h-full rounded-full transition-all duration-1000"
          style={{
            background: `radial-gradient(ellipse at center, rgba(224, 48, 0, ${lightIntensity}) 0%, rgba(224, 48, 0, ${lightIntensity * 0.3}) 40%, transparent 70%)`,
            boxShadow: `0 0 ${20 + progress * 30}px ${5 + progress * 15}px rgba(224, 48, 0, ${lightIntensity * 0.8})`,
            filter: `blur(${2 - progress}px)`,
          }}
        />
      </div>

      {/* Forehead Sensor Light */}
      <div 
        ref={foreheadRef}
        className="absolute top-[18%] left-1/2 -translate-x-1/2 w-6 h-8 pointer-events-none"
        style={{
          opacity: 0.2,
        }}
      >
        <div 
          className="w-full h-full rounded transition-all duration-1000"
          style={{
            background: `linear-gradient(180deg, rgba(224, 48, 0, ${lightIntensity}) 0%, rgba(224, 48, 0, ${lightIntensity * 0.5}) 100%)`,
          }}
        />
      </div>

      {/* Hex code rain effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="hex-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            {Array.from({ length: 10 }).map((_, j) => (
              <div key={j}>{Math.random().toString(16).substr(2, 2).toUpperCase()}</div>
            ))}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav 
        ref={navRef}
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-oracle-red rounded-full danger-pulse" />
          <span className="font-manrope text-sm text-white/80 tracking-widest uppercase">
            预警系统在线
          </span>
        </div>
        
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group relative font-manrope text-sm text-white/70 hover:text-white transition-colors duration-300"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-oracle-red group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenUserInput}
            className="flex items-center gap-2 px-4 py-2 bg-oracle-red/20 border border-oracle-red/40 rounded-lg hover:bg-oracle-red/30 transition-colors"
          >
            <User className="w-4 h-4 text-oracle-red" />
            <span className="font-manrope text-xs text-oracle-red">
              {userInfo ? userInfo.nickname : '输入职业'}
            </span>
          </button>
          
          <button
            onClick={onShare}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Camera className="w-4 h-4 text-white/60" />
            <span className="font-manrope text-xs text-white/60">分享</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* User info badge if available */}
        {userInfo && (
          <div className="mb-4 px-4 py-2 bg-oracle-red/10 border border-oracle-red/30 rounded-full">
            <span className="font-manrope text-xs text-oracle-red">
              {userInfo.nickname} · {userInfo.occupation}
            </span>
          </div>
        )}

        {/* Slogan */}
        <div 
          ref={sloganRef}
          className="mb-8 text-center"
        >
          <p className="font-manrope text-sm md:text-base text-white/60 tracking-[0.3em] uppercase mb-2">
            We document the end of the Carbon Age
          </p>
          <p className="font-manrope text-xs md:text-sm text-oracle-red/80 tracking-widest">
            我们记录碳基时代的终结
          </p>
        </div>

        {/* Countdown - The Oracle */}
        <div 
          ref={countdownRef}
          className="text-center"
        >
          <p className="font-manrope text-xs text-white/40 tracking-widest uppercase mb-4">
            {personalCountdown ? '您的职业倒计时' : '距离AGI剩余时间'}
          </p>
          
          <div className="flex items-baseline justify-center gap-4 md:gap-8">
            <div className="text-center">
              <div className="font-thunder text-6xl md:text-8xl lg:text-9xl text-white leading-none data-breathe">
                {personalCountdown ? displayCountdown.years : displayText.years}
              </div>
              <span className="font-manrope text-xs text-white/50 tracking-widest uppercase mt-2 block">
                年
              </span>
            </div>
            
            <div className="font-thunder text-4xl md:text-6xl text-oracle-red/60">:</div>
            
            <div className="text-center">
              <div className="font-thunder text-6xl md:text-8xl lg:text-9xl text-white leading-none data-breathe">
                {personalCountdown ? displayCountdown.months.toString().padStart(2, '0') : displayText.months}
              </div>
              <span className="font-manrope text-xs text-white/50 tracking-widest uppercase mt-2 block">
                月
              </span>
            </div>
            
            <div className="font-thunder text-4xl md:text-6xl text-oracle-red/60">:</div>
            
            <div className="text-center">
              <div className="font-thunder text-6xl md:text-8xl lg:text-9xl text-white leading-none data-breathe">
                {personalCountdown ? displayCountdown.days.toString().padStart(2, '0') : displayText.days}
              </div>
              <span className="font-manrope text-xs text-white/50 tracking-widest uppercase mt-2 block">
                天
              </span>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded">
            <div className="w-2 h-2 bg-oracle-red rounded-full animate-pulse" />
            <span className="font-manrope text-xs text-white/60 tracking-wider">
              {eyesOpen ? 'AGI觉醒中' : '系统监测中'}
            </span>
          </div>
          
          {/* Light intensity indicator */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded">
            <div 
              className="w-16 h-1 bg-white/20 rounded-full overflow-hidden"
            >
              <div 
                className="h-full bg-oracle-red rounded-full transition-all duration-500"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="font-manrope text-xs text-white/40">
              {(progress * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none scanlines opacity-30" />
    </section>
  );
};

export default Hero;
