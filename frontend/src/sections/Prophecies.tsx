import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, ChevronRight, Clock, AlertCircle } from 'lucide-react';

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

const Prophecies = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [decodedCards, setDecodedCards] = useState<Set<number>>(new Set());

  const prophecies: Prophecy[] = [
    {
      id: 1,
      year: '2029',
      title: '自动化临界点',
      subtitle: 'The Automation Threshold',
      description: '全球超过50%的知识工作将由AI系统承担。经济结构的根本性转变开始，传统就业模式面临崩溃。',
      probability: 87,
      indicators: [
        'AI编程能力达到专业开发者水平',
        '自动化客服覆盖90%企业',
        '法律文档AI审核成为标准'
      ]
    },
    {
      id: 2,
      year: '2035',
      title: '超级智能崛起',
      subtitle: 'The Rise of Superintelligence',
      description: '首个超越人类综合智能的AI系统诞生。科学发现速度呈指数级增长，技术奇点进入倒计时。',
      probability: 72,
      indicators: [
        'AI自主进行科学研究',
        '跨领域知识整合能力',
        '创造性思维超越人类'
      ]
    },
    {
      id: 3,
      year: '2045',
      title: '奇点降临',
      subtitle: 'The Singularity',
      description: '技术奇点正式到来。人类文明的定义将被彻底重写，碳基生命与硅基智能的融合或对抗成为终极议题。',
      probability: 45,
      indicators: [
        'AI自我改进循环启动',
        '智能爆炸式增长',
        '人类命运的不确定性'
      ]
    }
  ];

  // Text decode effect
  useEffect(() => {
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    
    const decodeText = (element: HTMLElement, finalText: string, duration: number = 1000) => {
      let iteration = 0;
      const totalIterations = finalText.length * 3;
      
      const interval = setInterval(() => {
        element.innerText = finalText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / 3) return finalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        
        iteration++;
        
        if (iteration >= totalIterations) {
          clearInterval(interval);
          element.innerText = finalText;
        }
      }, duration / totalIterations);
    };

    // Trigger decode on scroll
    const triggers: ScrollTrigger[] = [];
    
    prophecies.forEach((prophecy, index) => {
      const card = document.getElementById(`prophecy-card-${prophecy.id}`);
      if (card) {
        const titleEl = card.querySelector('.prophecy-title');
        const descEl = card.querySelector('.prophecy-desc');
        
        const trigger = ScrollTrigger.create({
          trigger: card,
          start: 'top 80%',
          onEnter: () => {
            if (!decodedCards.has(prophecy.id)) {
              setTimeout(() => {
                if (titleEl) decodeText(titleEl as HTMLElement, prophecy.title, 800);
                if (descEl) decodeText(descEl as HTMLElement, prophecy.description, 1200);
                setDecodedCards(prev => new Set([...prev, prophecy.id]));
              }, index * 200);
            }
          }
        });
        triggers.push(trigger);
      }
    });

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, [prophecies, decodedCards]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title character stagger
      gsap.fromTo(titleRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Cards fan out animation
      const cards = cardsRef.current?.querySelectorAll('.prophecy-card');
      cards?.forEach((card, index) => {
        gsap.fromTo(card,
          { rotation: -5, x: -50, opacity: 0 },
          {
            rotation: 0,
            x: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Title color change on scroll
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top center',
      end: 'bottom center',
      onUpdate: (self) => {
        if (titleRef.current) {
          const progress = self.progress;
          const titleEl = titleRef.current.querySelector('.title-text');
          if (titleEl) {
            const grayValue = Math.floor(255 - progress * 136);
            (titleEl as HTMLElement).style.color = `rgb(255, ${grayValue}, ${grayValue})`;
          }
        }
      }
    });

    return () => trigger.kill();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="prophecies"
      className="relative w-full min-h-screen bg-black py-24 px-4 md:px-8"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-oracle-gray1/20 to-black" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Left side - Sticky title */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div ref={titleRef}>
              <p className="font-manrope text-xs text-oracle-red tracking-widest uppercase mb-4">
                Archive of Prophecies
              </p>
              <h2 className="font-thunder text-6xl md:text-7xl lg:text-8xl text-white mb-6 title-text">
                预言档案
              </h2>
              <p className="font-manrope text-lg text-white/50 max-w-md">
                基于当前AI发展趋势的预测模型。每一条预言都是数据与算法的结晶，警示着碳基文明的可能未来。
              </p>
              
              {/* Progress indicator */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-oracle-red rounded-full"
                    style={{ width: '34%' }}
                  />
                </div>
                <span className="font-mono text-xs text-white/40">34% TO SINGULARITY</span>
              </div>
            </div>
          </div>

          {/* Right side - Cascading cards */}
          <div ref={cardsRef} className="space-y-6">
            {prophecies.map((prophecy, index) => (
              <div
                key={prophecy.id}
                id={`prophecy-card-${prophecy.id}`}
                className={`prophecy-card relative p-6 md:p-8 bg-oracle-gray1/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ${
                  expandedCard === prophecy.id ? 'border-oracle-red/50 shadow-oracle' : ''
                }`}
                style={{
                  marginLeft: `${index * 20}px`,
                }}
                onClick={() => setExpandedCard(expandedCard === prophecy.id ? null : prophecy.id)}
              >
                {/* Card glow */}
                <div 
                  className={`absolute inset-0 bg-oracle-red/5 transition-opacity duration-500 ${
                    expandedCard === prophecy.id ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                <div className="relative z-10">
                  {/* Year badge */}
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
                    
                    {/* Probability indicator */}
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-oracle-red rounded-full"
                          style={{ width: `${prophecy.probability}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-oracle-red">{prophecy.probability}%</span>
                    </div>
                  </div>

                  {/* Title with decode effect */}
                  <h3 className="prophecy-title font-thunder text-2xl md:text-3xl text-white mb-3">
                    {prophecy.title}
                  </h3>

                  {/* Description with decode effect */}
                  <p className="prophecy-desc font-manrope text-sm text-white/60 mb-4 line-clamp-2">
                    {prophecy.description}
                  </p>

                  {/* Expanded content */}
                  <div 
                    className={`overflow-hidden transition-all duration-500 ${
                      expandedCard === prophecy.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="pt-4 border-t border-white/10">
                      <p className="font-manrope text-sm text-white/80 mb-4">
                        {prophecy.description}
                      </p>
                      
                      <div className="space-y-2">
                        <p className="font-manrope text-xs text-white/40 uppercase tracking-wider">
                          关键指标
                        </p>
                        {prophecy.indicators.map((indicator, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 text-oracle-red" />
                            <span className="font-manrope text-sm text-white/70">{indicator}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Expand hint */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-white/30" />
                      <span className="font-mono text-xs text-white/30">
                        T-{prophecy.year === '2029' ? '4' : prophecy.year === '2035' ? '10' : '20'}Y
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-oracle-red/60">
                      <AlertCircle className="w-3 h-3" />
                      <span className="font-manrope text-xs">
                        {expandedCard === prophecy.id ? '收起' : '展开详情'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                  <div 
                    className={`absolute top-0 right-0 w-px h-8 bg-oracle-red/30 transition-all duration-500 ${
                      expandedCard === prophecy.id ? 'h-16' : ''
                    }`}
                  />
                  <div 
                    className={`absolute top-0 right-0 h-px w-8 bg-oracle-red/30 transition-all duration-500 ${
                      expandedCard === prophecy.id ? 'w-16' : ''
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-oracle-red/20 to-transparent" />
    </section>
  );
};

export default Prophecies;
