import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Zap, Database, TrendingUp, Brain, Loader2 } from 'lucide-react';
import { getAIAnalyzedMetrics, type MetricData } from '@/services/aiDataService';

gsap.registerPlugin(ScrollTrigger);

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  change: string;
  icon: React.ReactNode;
  delay: number;
  aiAnalysis: string;
}

const MetricCard = ({ title, value, unit, change, icon, delay, aiAnalysis }: MetricCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState('0');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    const prefix = value.match(/^[^0-9]*/)?.[0] || '';
    const suffix = value.match(/[^0-9.]*$/)?.[0] || '';
    
    let start = 0;
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (numericValue - start) * easeProgress;
      
      if (value.includes('.')) {
        setDisplayValue(prefix + current.toFixed(1) + suffix);
      } else {
        setDisplayValue(prefix + Math.floor(current).toLocaleString() + suffix);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { y: 100, scale: 0.9, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.8,
          delay: delay / 1000,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [delay]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    gsap.to(cardRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className="relative p-6 bg-oracle-gray1/80 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden group"
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={`absolute inset-0 bg-oracle-red/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      />
      
      <div 
        className={`absolute inset-0 border border-oracle-red/30 rounded-lg transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-oracle-red/10 rounded">
            {icon}
          </div>
          <span className={`font-manrope text-xs ${change.startsWith('+') ? 'text-green-400' : 'text-oracle-red'}`}>
            {change}
          </span>
        </div>

        <h3 className="font-manrope text-sm text-white/60 mb-2">{title}</h3>
        
        <div className="flex items-baseline gap-1">
          <span className="font-thunder text-4xl md:text-5xl text-white tracking-tight">
            {displayValue}
          </span>
          <span className="font-manrope text-sm text-white/40">{unit}</span>
        </div>

        {/* AI Analysis on hover */}
        <div 
          className={`mt-4 pt-4 border-t border-white/10 transition-all duration-500 ${
            isHovered ? 'opacity-100 max-h-32' : 'opacity-0 max-h-0'
          } overflow-hidden`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-3 h-3 text-oracle-red" />
            <span className="font-manrope text-xs text-oracle-red uppercase tracking-wider">AI分析</span>
          </div>
          <p className="font-manrope text-xs text-white/60 leading-relaxed">{aiAnalysis}</p>
        </div>
      </div>

      <div className="absolute bottom-2 right-2 w-1 h-1 bg-oracle-red rounded-full animate-pulse" />
    </div>
  );
};

const MetricsPanel = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const iconMap: Record<string, React.ReactNode> = {
    '计算增长': <Cpu className="w-5 h-5 text-oracle-red" />,
    '训练能耗': <Zap className="w-5 h-5 text-oracle-red" />,
    '参数指数': <Database className="w-5 h-5 text-oracle-red" />,
    '数据集规模': <TrendingUp className="w-5 h-5 text-oracle-red" />
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await getAIAnalyzedMetrics();
      setMetrics(data);
      setLoading(false);
      setLastUpdate(new Date());
    };

    fetchMetrics();

    // Refresh every 10 seconds
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.0,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(chartRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: chartRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const chartPoints = [
    { x: 0, y: 80 },
    { x: 10, y: 75 },
    { x: 20, y: 70 },
    { x: 30, y: 65 },
    { x: 40, y: 55 },
    { x: 50, y: 45 },
    { x: 60, y: 35 },
    { x: 70, y: 25 },
    { x: 80, y: 15 },
    { x: 90, y: 8 },
    { x: 100, y: 2 }
  ];

  const pathData = chartPoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  return (
    <section 
      ref={sectionRef}
      id="metrics"
      className="relative w-full min-h-screen bg-black py-24 px-4 md:px-8"
    >
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(224, 48, 0, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(224, 48, 0, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <Brain className="w-6 h-6 text-oracle-red" />
            <span className="font-manrope text-xs text-oracle-red uppercase tracking-widest">AI实时分析</span>
          </div>
          <h2 
            ref={titleRef}
            className="font-thunder text-5xl md:text-7xl lg:text-8xl text-white mb-4"
          >
            AI发展指标
          </h2>
          <p className="font-manrope text-lg text-white/50">
            实时追踪通往奇点的路径 · 数据由AI模型持续分析
          </p>
        </div>

        <div 
          ref={chartRef}
          className="relative mb-12 p-8 bg-oracle-gray1/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-manrope text-sm text-white/60 uppercase tracking-widest">
              智能奇点曲线
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-oracle-red rounded-full animate-pulse" />
                <span className="font-manrope text-xs text-white/50">AI实时数据流</span>
              </div>
              <span className="font-mono text-xs text-white/30">
                更新: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>
          
          <div className="relative h-64 md:h-80">
            <svg 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full"
            >
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="0.2"
                />
              ))}
              
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e03000" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#e03000" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`${pathData} L 100 100 L 0 100 Z`}
                fill="url(#chartGradient)"
              />
              
              <path
                d={pathData}
                fill="none"
                stroke="#e03000"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_10px_rgba(224,48,0,0.5)]"
              />
              
              <circle
                cx="100"
                cy="2"
                r="1.5"
                fill="#e03000"
                className="animate-pulse"
              >
                <animate
                  attributeName="r"
                  values="1.5;2;1.5"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
            
            <div className="absolute bottom-0 left-0 font-manrope text-xs text-white/30">
              2020
            </div>
            <div className="absolute bottom-0 right-0 font-manrope text-xs text-white/30">
              AGI
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-oracle-red animate-spin" />
            <span className="ml-3 font-manrope text-white/60">AI分析数据中...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <MetricCard 
                key={metric.title}
                {...metric}
                icon={iconMap[metric.title] || <TrendingUp className="w-5 h-5 text-oracle-red" />}
                delay={500 + index * 100}
              />
            ))}
          </div>
        )}

        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-oracle-red/30 to-transparent" />
          <div className="flex items-center gap-2 px-4 py-2 bg-oracle-red/10 border border-oracle-red/20 rounded">
            <Brain className="w-4 h-4 text-oracle-red" />
            <span className="font-manrope text-xs text-oracle-red tracking-wider uppercase">
              AI警告：增长速度超出预期
            </span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-oracle-red/30 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default MetricsPanel;
