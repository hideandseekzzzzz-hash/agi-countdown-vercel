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
    const startTime = Date.now();
    const duration = 1000;

    const animate = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numericValue * eased;

      if (value.includes('.')) {
        setDisplayValue(`${prefix}${current.toFixed(1)}${suffix}`);
      } else {
        setDisplayValue(`${prefix}${Math.floor(current).toLocaleString()}${suffix}`);
      }

      if (progress < 1) requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => requestAnimationFrame(animate), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div
      ref={cardRef}
      className="relative p-6 bg-oracle-gray1/80 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-oracle-red/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-oracle-red/10 rounded">{icon}</div>
          <span className={`font-manrope text-xs ${change.startsWith('+') ? 'text-green-400' : 'text-oracle-red'}`}>{change}</span>
        </div>

        <h3 className="font-manrope text-sm text-white/60 mb-2">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="font-thunder text-4xl md:text-5xl text-white tracking-tight">{displayValue}</span>
          <span className="font-manrope text-sm text-white/40">{unit}</span>
        </div>

        <div className={`mt-4 pt-4 border-t border-white/10 transition-all duration-500 ${isHovered ? 'opacity-100 max-h-32' : 'opacity-0 max-h-0'} overflow-hidden`}>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-3 h-3 text-oracle-red" />
            <span className="font-manrope text-xs text-oracle-red uppercase tracking-wider">AI Analysis</span>
          </div>
          <p className="font-manrope text-xs text-white/60 leading-relaxed">{aiAnalysis}</p>
        </div>
      </div>
    </div>
  );
};

const MetricsPanel = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const iconMap: Record<string, React.ReactNode> = {
    'Compute Growth': <Cpu className="w-5 h-5 text-oracle-red" />,
    'Training Energy': <Zap className="w-5 h-5 text-oracle-red" />,
    'Parameter Scale': <Database className="w-5 h-5 text-oracle-red" />,
    'Dataset Scale': <TrendingUp className="w-5 h-5 text-oracle-red" />
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await getAIAnalyzedMetrics();
      setMetrics(data);
      setLastUpdate(new Date());
      setLoading(false);
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="metrics" className="relative w-full min-h-screen bg-black py-24 px-4 md:px-8">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <Brain className="w-6 h-6 text-oracle-red" />
            <span className="font-manrope text-xs text-oracle-red uppercase tracking-widest">Live AI Analysis</span>
          </div>
          <h2 className="font-thunder text-5xl md:text-7xl lg:text-8xl text-white mb-4">Live Capability Metrics</h2>
          <p className="font-manrope text-lg text-white/50">Updated every 10 seconds from live signal aggregation.</p>
          <p className="font-mono text-xs text-white/30 mt-2">Last update: {lastUpdate.toLocaleTimeString()}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-oracle-red animate-spin" />
            <span className="ml-3 font-manrope text-white/60">Loading live metrics...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <MetricCard
                key={metric.title}
                {...metric}
                icon={iconMap[metric.title] || <TrendingUp className="w-5 h-5 text-oracle-red" />}
                delay={index * 120}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MetricsPanel;
