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
import { getSingularityPrediction } from './services/aiDataService';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const progressRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  
  // User state
  const [userInfo, setUserInfo] = useState<{ nickname: string; occupation: string } | null>(null);
  const [personalCountdown, setPersonalCountdown] = useState<{ years: number; months: number; days: number } | null>(null);
  const [globalCountdown, setGlobalCountdown] = useState<{ years: number; months: number; days: number }>({
    years: 14,
    months: 3,
    days: 2
  });
  
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

  useEffect(() => {
    const fetchPrediction = async () => {
      const prediction = await getSingularityPrediction();
      if (prediction.countdown) {
        setGlobalCountdown(prediction.countdown);
      }
    };

    fetchPrediction();
    const interval = setInterval(fetchPrediction, 60000);
    return () => clearInterval(interval);
  }, []);

  // Get current countdown for sharing
  const currentCountdown = personalCountdown || globalCountdown;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_20%_-10%,rgba(0,166,255,0.16),transparent_60%),radial-gradient(1000px_500px_at_90%_10%,rgba(224,48,0,0.12),transparent_55%),linear-gradient(180deg,#05070b_0%,#020304_100%)]" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      </div>

      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-[100]">
        <div 
          ref={progressRef}
          className="h-full bg-oracle-red transition-all duration-100"
          style={{ width: '0%' }}
        />
      </div>

      {/* Main content */}
      <main ref={mainRef} className="relative z-10">
        <Hero 
          personalCountdown={personalCountdown}
          globalCountdown={globalCountdown}
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
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/15 rounded">
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
