import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertTriangle, Radio, Terminal, Brain, Loader2, ExternalLink } from 'lucide-react';
import { getAICuratedNews, type NewsItem } from '@/services/aiDataService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

const NewsTicker = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [glitchActive, setGlitchActive] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchNews = async () => {
      const data = await getAICuratedNews();
      setNews(data);
      setLoading(false);
      setLastUpdate(new Date());
    };

    fetchNews();

    // Refresh every 30 seconds
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { rotateX: 90, opacity: 0 },
        {
          rotateX: 0,
          opacity: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const triggerGlitch = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
      
      const nextGlitch = Math.random() * 5000 + 3000;
      setTimeout(triggerGlitch, nextGlitch);
    };

    const timer = setTimeout(triggerGlitch, 5000);
    return () => clearTimeout(timer);
  }, []);

  const duplicatedItems = [...news, ...news];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-oracle-red';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-white/60';
      default: return 'text-white/60';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-3 h-3 text-oracle-red" />;
      case 'medium': return <Radio className="w-3 h-3 text-yellow-500" />;
      case 'low': return <Terminal className="w-3 h-3 text-white/40" />;
      default: return null;
    }
  };

  const highPriorityCount = news.filter(n => n.priority === 'high').length;

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-16 bg-black overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="w-full h-2 bg-gradient-to-b from-transparent via-oracle-red/10 to-transparent"
          style={{
            animation: 'scan-line 4s linear infinite'
          }}
        />
      </div>

      <div className="relative z-10 px-4 md:px-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-oracle-red/20 rounded flex items-center justify-center">
              <Brain className="w-4 h-4 text-oracle-red animate-pulse" />
            </div>
            <div>
              <h3 className="font-thunder text-2xl md:text-3xl text-white tracking-wide">
                神谕新闻流
              </h3>
              <p className="font-manrope text-xs text-white/40 tracking-wider">
                ORACLE NEWS TICKER // AI筛选与汇总
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {loading ? (
              <Loader2 className="w-5 h-5 text-oracle-red animate-spin" />
            ) : (
              <>
                <span className="font-mono text-xs text-white/30">
                  更新: {lastUpdate.toLocaleTimeString()}
                </span>
                <div className="flex items-center gap-2 px-3 py-1 bg-oracle-red/10 border border-oracle-red/30 rounded">
                  <AlertTriangle className="w-3 h-3 text-oracle-red" />
                  <span className="font-manrope text-xs text-oracle-red">{highPriorityCount}条高优先级</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {[0, 1, 2].map((bandIndex) => (
          <div 
            key={bandIndex}
            className={`relative overflow-hidden py-3 ${
              bandIndex === 1 ? 'bg-oracle-red/5' : 'bg-transparent'
            }`}
            style={{
              transform: `rotateX(${(bandIndex - 1) * 2}deg)`,
            }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-oracle-red/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-oracle-red/30 to-transparent" />

            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 text-oracle-red animate-spin mr-2" />
                <span className="font-manrope text-sm text-white/60">AI筛选新闻中...</span>
              </div>
            ) : (
              <div 
                className={`flex whitespace-nowrap ${glitchActive ? 'animate-glitch' : ''}`}
                style={{
                  animation: `ticker-scroll ${30 + bandIndex * 5}s linear infinite`,
                  animationDirection: bandIndex % 2 === 0 ? 'normal' : 'reverse'
                }}
              >
                {duplicatedItems.map((item, index) => (
                  <button
                    key={`${item.id}-${index}`}
                    className="flex items-center gap-4 px-8 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedNews(item)}
                  >
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(item.priority)}
                      <span className={`font-manrope text-xs ${getPriorityColor(item.priority)}`}>
                        [{item.priority.toUpperCase()}]
                      </span>
                    </div>

                    <span className="font-mono text-xs text-white/30">
                      {item.timestamp}
                    </span>

                    <span className="font-manrope text-sm text-white/80 hover:text-white transition-colors">
                      {item.text}
                    </span>

                    <span className="text-oracle-red/40 mx-4">◆</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {glitchActive && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, rgba(255,0,0,0.1) 0%, transparent 50%, rgba(0,255,255,0.1) 100%)',
              mixBlendMode: 'screen'
            }}
          />
        )}
      </div>

      <div className="relative z-10 mt-8 px-4 md:px-8">
        <div className="flex items-center justify-between py-3 border-t border-white/10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-manrope text-xs text-white/50">AI筛选正常</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-oracle-red rounded-full animate-pulse" />
              <span className="font-manrope text-xs text-white/50">{highPriorityCount}条高优先级预警</span>
            </div>
          </div>
          
          <div className="font-mono text-xs text-white/30">
            LAST UPDATE: {lastUpdate.toISOString().split('T')[1].split('.')[0]} UTC
          </div>
        </div>
      </div>

      {glitchActive && (
        <>
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-screen"
            style={{ 
              background: 'rgba(255, 0, 0, 0.05)',
              transform: 'translateX(2px)'
            }}
          />
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-screen"
            style={{ 
              background: 'rgba(0, 255, 255, 0.05)',
              transform: 'translateX(-2px)'
            }}
          />
        </>
      )}

      {/* News Detail Dialog */}
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="bg-oracle-gray1 border-white/10 max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              {selectedNews && getPriorityIcon(selectedNews.priority)}
              <span className={`font-manrope text-xs ${selectedNews ? getPriorityColor(selectedNews.priority) : ''}`}>
                [{selectedNews?.priority.toUpperCase()}]
              </span>
              <span className="font-mono text-xs text-white/30">{selectedNews?.timestamp}</span>
            </div>
            <DialogTitle className="font-thunder text-xl text-white">
              {selectedNews?.text}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 bg-oracle-red/10 border border-oracle-red/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-oracle-red" />
                <span className="font-manrope text-xs text-oracle-red uppercase tracking-wider">AI分析摘要</span>
              </div>
              <p className="font-manrope text-sm text-white/80">{selectedNews?.aiSummary}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-manrope text-xs text-white/40">来源: {selectedNews?.source}</span>
              <button className="flex items-center gap-2 text-oracle-red hover:text-oracle-red/80 transition-colors">
                <span className="font-manrope text-xs">查看原文</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default NewsTicker;
