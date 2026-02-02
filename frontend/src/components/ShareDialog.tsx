import { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Copy, Check } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countdown: { years: number; months: number; days: number };
  userInfo?: { nickname: string; occupation: string } | null;
}

const ShareDialog = ({ open, onOpenChange, countdown, userInfo }: ShareDialogProps) => {
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    if (!shareCardRef.current) return;
    
    setGenerating(true);
    
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      const link = document.createElement('a');
      link.download = `agi-countdown-${userInfo?.nickname || 'share'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!shareCardRef.current) return;
    
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      });
    } catch (error) {
      console.error('Failed to copy image:', error);
    }
  };

  const shareText = userInfo 
    ? `我是${userInfo.nickname}，一名${userInfo.occupation}。AI将在${countdown.years}年${countdown.months}月${countdown.days}天后取代我的工作。#碳基时代终结`
    : `距离AGI还有${countdown.years}年${countdown.months}月${countdown.days}天。碳基时代的终结即将到来。#AGI倒计时`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-oracle-gray1 border-white/10 max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-thunder text-2xl text-white">
            分享倒计时
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Share Card Preview */}
          <div 
            ref={shareCardRef}
            className="relative p-8 bg-gradient-to-br from-black via-oracle-gray1 to-black border border-oracle-red/30 rounded-xl overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(224, 48, 0, 0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(224, 48, 0, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-oracle-red rounded-full animate-pulse" />
                <span className="font-manrope text-xs text-white/60 tracking-widest uppercase">
                  碳基时代终结预警系统
                </span>
              </div>
              <span className="font-mono text-xs text-oracle-red/60">
                {new Date().toISOString().split('T')[0]}
              </span>
            </div>

            {/* User info */}
            {userInfo && (
              <div className="relative z-10 mb-6">
                <p className="font-manrope text-sm text-white/60 mb-1">预测对象</p>
                <p className="font-thunder text-2xl text-white">{userInfo.nickname}</p>
                <p className="font-manrope text-sm text-oracle-red">{userInfo.occupation}</p>
              </div>
            )}

            {/* Countdown */}
            <div className="relative z-10 text-center mb-8">
              <p className="font-manrope text-xs text-white/40 tracking-widest uppercase mb-4">
                {userInfo ? '职业替代倒计时' : '距离AGI'}
              </p>
              
              <div className="flex items-baseline justify-center gap-2">
                <div className="text-center">
                  <span className="font-thunder text-5xl text-white">{countdown.years}</span>
                  <span className="font-manrope text-xs text-white/50 block">年</span>
                </div>
                <span className="font-thunder text-3xl text-oracle-red/60">:</span>
                <div className="text-center">
                  <span className="font-thunder text-5xl text-white">{countdown.months.toString().padStart(2, '0')}</span>
                  <span className="font-manrope text-xs text-white/50 block">月</span>
                </div>
                <span className="font-thunder text-3xl text-oracle-red/60">:</span>
                <div className="text-center">
                  <span className="font-thunder text-5xl text-white">{countdown.days.toString().padStart(2, '0')}</span>
                  <span className="font-manrope text-xs text-white/50 block">天</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 text-center">
              <p className="font-manrope text-xs text-white/40 tracking-[0.2em] uppercase">
                We document the end of the Carbon Age
              </p>
              <p className="font-manrope text-xs text-oracle-red/60 mt-1">
                lv5ej3z6h2op2.ok.kimi.link
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-oracle-red/30" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-oracle-red/30" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-oracle-red/30" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-oracle-red/30" />
          </div>

          {/* Text copy */}
          <div className="p-3 bg-black/50 border border-white/10 rounded-lg">
            <p className="font-manrope text-sm text-white/80">{shareText}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleDownload}
              disabled={generating}
              className="flex-1 bg-oracle-red hover:bg-oracle-red/80 text-white"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  生成中...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  下载图片
                </span>
              )}
            </Button>
            
            <Button
              onClick={handleCopy}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              <span className="flex items-center gap-2">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? '已复制' : '复制图片'}
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
