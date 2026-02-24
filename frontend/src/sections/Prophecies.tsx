import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, ChevronRight, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { getSingularityPrediction, type SingularityPrediction } from '@/services/aiDataService';

gsap.registerPlugin(ScrollTrigger);

interface Prophecy {
  id: number;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  probability: number;
  indicators: string[];
}

const fallbackPrediction: SingularityPrediction = {
  estimatedDate: '2038-06-15',
  confidence: 67,
  factors: ['Compute growth', 'Model capability jumps', 'Deployment speed'],
  aiAnalysis: 'Prediction service unavailable. Using fallback timeline.',
  countdown: { years: 14, months: 3, days: 2 },
  newsPulse: 50,
  signalStats: { highPriority: 0, rawSignalCount: 0 },
  lastUpdated: new Date().toISOString()
};

const Prophecies = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<SingularityPrediction>(fallbackPrediction);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      const data = await getSingularityPrediction();
      setPrediction(data);
      setLoading(false);
    };

    fetchPrediction();
    const interval = setInterval(fetchPrediction, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const prophecies: Prophecy[] = useMemo(() => {
    const targetYear = new Date(prediction.estimatedDate).getFullYear();
    const automationYear = Math.max(new Date().getFullYear(), targetYear - 5);
    const superYear = Math.max(automationYear + 1, targetYear - 1);
    const singularityYear = targetYear;

    return [
      {
        id: 1,
        year: String(automationYear),
        title: 'Automation Threshold',
        subtitle: 'Operational crossover',
        description:
          'Knowledge-work automation reaches broad production deployment. Human roles shift toward supervision, orchestration, and edge-case handling.',
        probability: Math.max(40, prediction.confidence - 12),
        indicators: [
          `News pulse: ${prediction.newsPulse}/100`,
          `High-priority signals: ${prediction.signalStats.highPriority}`,
          'Agentic workflows moving into production'
        ]
      },
      {
        id: 2,
        year: String(superYear),
        title: 'General Capability Crossover',
        subtitle: 'Cross-domain acceleration',
        description:
          'Model systems transition from narrow excellence to broad cross-domain competence, accelerating scientific and engineering output.',
        probability: Math.max(35, prediction.confidence - 5),
        indicators: prediction.factors.slice(0, 3)
      },
      {
        id: 3,
        year: String(singularityYear),
        title: 'Projected AGI Date',
        subtitle: prediction.estimatedDate,
        description: prediction.aiAnalysis,
        probability: prediction.confidence,
        indicators: [
          `Countdown: ${prediction.countdown.years}Y ${String(prediction.countdown.months).padStart(2, '0')}M ${String(prediction.countdown.days).padStart(2, '0')}D`,
          `Raw signals: ${prediction.signalStats.rawSignalCount}`,
          `Last update: ${new Date(prediction.lastUpdated).toLocaleTimeString()}`
        ]
      }
    ];
  }, [prediction]);

  return (
    <section ref={sectionRef} id="prophecies" className="relative w-full min-h-screen bg-black py-24 px-4 md:px-8">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="font-manrope text-xs text-oracle-red tracking-widest uppercase mb-3">Live Timeline Model</p>
          <h2 className="font-thunder text-5xl md:text-7xl text-white mb-4">Forecast Archive</h2>
          <p className="font-manrope text-lg text-white/50 max-w-3xl">
            Forecast cards are recalculated from live news intensity and AI signal density every 60 seconds.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center py-8">
            <Loader2 className="w-6 h-6 text-oracle-red animate-spin mr-3" />
            <span className="font-manrope text-white/60">Running live prediction...</span>
          </div>
        ) : null}

        <div className="space-y-6">
          {prophecies.map((prophecy) => (
            <div
              key={prophecy.id}
              className={`relative p-6 md:p-8 bg-oracle-gray1/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ${
                expandedCard === prophecy.id ? 'border-oracle-red/50 shadow-oracle' : ''
              }`}
              onClick={() => setExpandedCard(expandedCard === prophecy.id ? null : prophecy.id)}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-oracle-red/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-oracle-red" />
                    </div>
                    <div>
                      <span className="font-thunder text-3xl text-white">{prophecy.year}</span>
                      <span className="font-manrope text-xs text-white/40 ml-2">{prophecy.subtitle}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-oracle-red rounded-full" style={{ width: `${prophecy.probability}%` }} />
                    </div>
                    <span className="font-mono text-xs text-oracle-red">{prophecy.probability}%</span>
                  </div>
                </div>

                <h3 className="font-thunder text-2xl md:text-3xl text-white mb-3">{prophecy.title}</h3>
                <p className="font-manrope text-sm text-white/60 mb-4 line-clamp-2">{prophecy.description}</p>

                <div className={`overflow-hidden transition-all duration-500 ${expandedCard === prophecy.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pt-4 border-t border-white/10">
                    <p className="font-manrope text-sm text-white/80 mb-4">{prophecy.description}</p>
                    <div className="space-y-2">
                      <p className="font-manrope text-xs text-white/40 uppercase tracking-wider">Key Indicators</p>
                      {prophecy.indicators.map((indicator, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-oracle-red" />
                          <span className="font-manrope text-sm text-white/70">{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-white/30" />
                    <span className="font-mono text-xs text-white/30">
                      T-{Math.max(0, Number(prophecy.year) - new Date().getFullYear())}Y
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-oracle-red/60">
                    <AlertCircle className="w-3 h-3" />
                    <span className="font-manrope text-xs">{expandedCard === prophecy.id ? 'Collapse' : 'Expand'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Prophecies;
