import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, AlertTriangle, Radio, Mail, Github, Twitter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Top border draw
      gsap.fromTo(lineRef.current,
        { width: '0%' },
        {
          width: '100%',
          duration: 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Content fade in
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer 
      ref={sectionRef}
      id="about"
      className="relative w-full bg-black pt-16 pb-8 px-4 md:px-8"
    >
      {/* Top border line */}
      <div className="absolute top-0 left-0 right-0 flex justify-center">
        <div 
          ref={lineRef}
          className="h-px bg-gradient-to-r from-transparent via-oracle-red to-transparent"
          style={{ width: '0%' }}
        />
      </div>

      <div ref={contentRef} className="relative z-10 max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Left - Status */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-oracle-red/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-oracle-red" />
              </div>
              <div>
                <h3 className="font-thunder text-xl text-white">警告系统在线</h3>
                <p className="font-manrope text-xs text-white/40">WARNING SYSTEM ONLINE</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-manrope text-sm text-white/60">数据流正常</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-manrope text-sm text-white/60">预测模型运行中</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-oracle-red rounded-full animate-pulse" />
                <span className="font-manrope text-sm text-white/60">威胁等级：高</span>
              </div>
            </div>
          </div>

          {/* Center - Subscribe */}
          <div className="md:text-center">
            <div className="flex items-center gap-3 mb-6 md:justify-center">
              <div className="w-10 h-10 bg-oracle-red/20 rounded-lg flex items-center justify-center">
                <Radio className="w-5 h-5 text-oracle-red" />
              </div>
              <div>
                <h3 className="font-thunder text-xl text-white">加入观察名单</h3>
                <p className="font-manrope text-xs text-white/40">JOIN THE WATCHLIST</p>
              </div>
            </div>
            
            <form onSubmit={handleSubscribe} className="relative">
              <div className="relative border-glitch">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入您的邮箱"
                  className="w-full px-4 py-3 bg-oracle-gray1/50 border border-white/20 rounded-lg font-manrope text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-oracle-red/50 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-oracle-red/20 border border-oracle-red/40 rounded font-manrope text-xs text-oracle-red hover:bg-oracle-red/30 transition-colors"
                >
                  {subscribed ? '已订阅' : '订阅'}
                </button>
              </div>
              
              {subscribed && (
                <p className="mt-2 font-manrope text-xs text-green-400">
                  您已成功加入观察名单。末日预警将实时送达。
                </p>
              )}
            </form>
            
            <p className="mt-4 font-manrope text-xs text-white/30">
              接收关于AI发展的关键预警和预测更新
            </p>
          </div>

          {/* Right - Links */}
          <div className="md:text-right">
            <div className="flex items-center gap-3 mb-6 md:justify-end">
              <div className="w-10 h-10 bg-oracle-red/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-oracle-red" />
              </div>
              <div>
                <h3 className="font-thunder text-xl text-white">连接</h3>
                <p className="font-manrope text-xs text-white/40">CONNECT</p>
              </div>
            </div>
            
            <div className="flex gap-4 md:justify-end">
              <a 
                href="#" 
                className="w-10 h-10 bg-oracle-gray1/50 border border-white/10 rounded-lg flex items-center justify-center hover:border-oracle-red/50 hover:bg-oracle-red/10 transition-all"
              >
                <Twitter className="w-4 h-4 text-white/60" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-oracle-gray1/50 border border-white/10 rounded-lg flex items-center justify-center hover:border-oracle-red/50 hover:bg-oracle-red/10 transition-all"
              >
                <Github className="w-4 h-4 text-white/60" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-oracle-gray1/50 border border-white/10 rounded-lg flex items-center justify-center hover:border-oracle-red/50 hover:bg-oracle-red/10 transition-all"
              >
                <Mail className="w-4 h-4 text-white/60" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-oracle-red rounded-full danger-pulse" />
              <span className="font-manrope text-xs text-white/40 tracking-wider">
                碳基时代终结预警系统 v2.0.47
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="font-manrope text-xs text-white/30">
                © 2024 The Oracle Project
              </span>
              <span className="font-mono text-xs text-white/20">
                {new Date().toISOString().split('T')[0]} // T-MINUS 14Y 03M 02D
              </span>
            </div>
          </div>
        </div>

        {/* Final warning */}
        <div className="mt-8 text-center">
          <p className="font-manrope text-xs text-oracle-red/40 tracking-[0.3em] uppercase">
            We document the end of the Carbon Age
          </p>
        </div>
      </div>

      {/* Signal loss effect */}
      <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute inset-0 bg-gradient-to-t from-oracle-red/5 to-transparent" />
      </div>
    </footer>
  );
};

export default Footer;
