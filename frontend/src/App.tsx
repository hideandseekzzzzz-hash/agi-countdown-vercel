import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './sections/Hero';
import MetricsPanel from './sections/MetricsPanel';
import NewsTicker from './sections/NewsTicker';
import Prophecies from './sections/Prophecies';
import Footer from './sections/Footer';
import UserInputDialog from './components/UserInputDialog';
import ShareDialog from './components/ShareDialog';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const noiseRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  
  // User state
  const [userInfo, setUserInfo] = useState<{ nickname: string; occupation: string } | null>(null);
  const [personalCountdown, setPersonalCountdown] = useState<{ years: number; months: number; days: number } | null>(null);
  
  // Dialog states
  const [userInputOpen, setUserInputOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Scroll progress indicator
  useEffect(() => {
    const updateProgress = () => {
      if (progressRef.current) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressRef.current.style.width = `${progress}%`;
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  // Noise animation
  useEffect(() => {
    if (!noiseRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 200;
    canvas.height = 200;

    const generateNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 15;
      }

      ctx.putImageData(imageData, 0, 0);
      
      if (noiseRef.current) {
        noiseRef.current.style.backgroundImage = `url(${canvas.toDataURL()})`;
      }
    };

    generateNoise();
    const interval = setInterval(generateNoise, 100);

    return () => clearInterval(interval);
  }, []);

  // Smooth scroll setup
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    ScrollTrigger.refresh();

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const handleUserSubmit = (data: { 
    nickname: string; 
    occupation: string; 
    countdown: { years: number; months: number; days: number } 
  }) => {
    setUserInfo({ nickname: data.nickname, occupation: data.occupation });
    setPersonalCountdown(data.countdown);
  };

  const handleShare = () => {
    setShareOpen(true);
  };

  // Get current countdown for sharing
  const currentCountdown = personalCountdown || { years: 14, months: 3, days: 2 };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Noise overlay */}
      <div 
        ref={noiseRef}
        className="fixed inset-0 pointer-events-none z-[9999] opacity-30"
        style={{ 
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Scanlines overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9998] opacity-10"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          )`
        }}
      />

      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-[100]">
        <div 
          ref={progressRef}
          className="h-full bg-oracle-red transition-all duration-100"
          style={{ width: '0%' }}
        />
      </div>

      {/* Corner decorations */}
      <div className="fixed top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-oracle-red/30 pointer-events-none z-50" />
      <div className="fixed top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-oracle-red/30 pointer-events-none z-50" />
      <div className="fixed bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-oracle-red/30 pointer-events-none z-50" />
      <div className="fixed bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-oracle-red/30 pointer-events-none z-50" />

      {/* Main content */}
      <main ref={mainRef} className="relative">
        <Hero 
          personalCountdown={personalCountdown}
          userInfo={userInfo}
          onOpenUserInput={() => setUserInputOpen(true)}
          onShare={handleShare}
        />
        <MetricsPanel />
        <NewsTicker />
        <Prophecies />
        <Footer />
      </main>

      {/* Floating status indicator */}
      <div className="fixed bottom-8 right-8 z-50 hidden md:flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-sm border border-oracle-red/30 rounded">
          <div className="w-2 h-2 bg-oracle-red rounded-full animate-pulse" />
          <span className="font-mono text-xs text-white/60">SYS.ONLINE</span>
        </div>
        <div className="font-mono text-xs text-white/30">
          T-{currentCountdown.years}Y {currentCountdown.months.toString().padStart(2, '0')}M {currentCountdown.days.toString().padStart(2, '0')}D
        </div>
      </div>

      {/* User Input Dialog */}
      <UserInputDialog
        open={userInputOpen}
        onOpenChange={setUserInputOpen}
        onSubmit={handleUserSubmit}
      />

      {/* Share Dialog */}
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        countdown={currentCountdown}
        userInfo={userInfo}
      />
    </div>
  );
}

export default App;
