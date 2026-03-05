import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, ExternalLink, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { getAICuratedNews, type NewsItem } from '@/services/aiDataService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

const NewsTicker = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      const data = await getAICuratedNews();

      // Source-first ranking: verified items and source links appear first
      const ranked = [...data].sort((a, b) => {
        const aRank = (a.isVerified ? 2 : 0) + (a.sourceUrl ? 1 : 0);
        const bRank = (b.isVerified ? 2 : 0) + (b.sourceUrl ? 1 : 0);
        return bRank - aRank;
      });

      setNews(ranked);
      setLoading(false);
      setLastUpdate(new Date());
    };

    fetchNews();
    const interval = setInterval(fetchNews, 30000);
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

  const sourceCount = useMemo(() => new Set(news.map((item) => item.source)).size, [news]);
  const verifiedCount = useMemo(() => news.filter((item) => item.isVerified).length, [news]);

  return (
    <section ref={sectionRef} className="relative w-full bg-black py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="font-manrope text-xs tracking-[0.28em] uppercase text-white/40 mb-3">Live Signal Feed</p>
            <h3 className="font-thunder text-4xl md:text-6xl text-white leading-none">Verified News Stream</h3>
            <p className="font-manrope text-white/55 mt-3 max-w-2xl">
              Source-linked updates first. AI synthesis is separated and clearly labeled.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[280px]">
            <div className="rounded-lg border border-white/15 bg-white/[0.03] p-3">
              <p className="font-manrope text-[11px] uppercase tracking-wider text-white/40">Last Update</p>
              <p className="font-mono text-sm text-white/85 mt-1">{lastUpdate.toLocaleTimeString()}</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/[0.03] p-3">
              <p className="font-manrope text-[11px] uppercase tracking-wider text-white/40">Sources</p>
              <p className="font-mono text-sm text-white/85 mt-1">{sourceCount}</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/[0.03] p-3">
              <p className="font-manrope text-[11px] uppercase tracking-wider text-white/40">Verified</p>
              <p className="font-mono text-sm text-white/85 mt-1">{verifiedCount}</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/[0.03] p-3">
              <p className="font-manrope text-[11px] uppercase tracking-wider text-white/40">Refresh</p>
              <p className="font-mono text-sm text-white/85 mt-1">30s</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 border border-white/10 rounded-xl bg-white/[0.02]">
            <Loader2 className="w-5 h-5 text-oracle-red animate-spin mr-2" />
            <span className="font-manrope text-white/60">Loading live news feed...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className="text-left group rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-5"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {item.isVerified ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-oracle-red" />
                    )}
                    <span className="font-manrope text-xs text-white/70 uppercase tracking-wider">
                      {item.isVerified ? 'Verified Source' : 'AI Synthesis'}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-white/40">
                    {item.publishedAt ? new Date(item.publishedAt).toLocaleTimeString() : item.timestamp}
                  </span>
                </div>

                <h4 className="font-manrope text-sm md:text-base text-white/90 leading-relaxed mb-3 group-hover:text-white">
                  {item.text}
                </h4>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-white/50">{item.source}</span>
                  {item.sourceUrl ? (
                    <span className="inline-flex items-center gap-1 text-oracle-red">
                      Source
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="text-white/35">No direct link</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="bg-oracle-gray1 border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-thunder text-2xl text-white">{selectedNews?.text}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span className="font-mono">{selectedNews?.source}</span>
              <span className="font-mono">
                {selectedNews?.publishedAt ? new Date(selectedNews.publishedAt).toLocaleString() : selectedNews?.timestamp}
              </span>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-oracle-red" />
                <span className="font-manrope text-xs uppercase tracking-wider text-oracle-red">AI Summary</span>
              </div>
              <p className="font-manrope text-sm text-white/80 leading-relaxed">{selectedNews?.aiSummary}</p>
            </div>

            {selectedNews?.sourceUrl ? (
              <a
                href={selectedNews.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-oracle-red hover:text-oracle-red/80 transition-colors font-manrope text-sm"
              >
                Open original source
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default NewsTicker;
