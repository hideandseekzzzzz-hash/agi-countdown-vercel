import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Brain, AlertTriangle } from 'lucide-react';

interface UserInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { nickname: string; occupation: string; countdown: { years: number; months: number; days: number } }) => void;
}

const OCCUPATIONS = [
  { value: 'software_engineer', label: '软件工程师', risk: 'high', multiplier: 0.3 },
  { value: 'data_analyst', label: '数据分析师', risk: 'high', multiplier: 0.25 },
  { value: 'content_writer', label: '内容创作者', risk: 'high', multiplier: 0.2 },
  { value: 'graphic_designer', label: '平面设计师', risk: 'medium', multiplier: 0.5 },
  { value: 'translator', label: '翻译员', risk: 'high', multiplier: 0.2 },
  { value: 'customer_service', label: '客服专员', risk: 'high', multiplier: 0.25 },
  { value: 'accountant', label: '会计师', risk: 'medium', multiplier: 0.6 },
  { value: 'lawyer', label: '律师', risk: 'medium', multiplier: 0.7 },
  { value: 'doctor', label: '医生', risk: 'low', multiplier: 1.2 },
  { value: 'nurse', label: '护士', risk: 'medium', multiplier: 0.8 },
  { value: 'teacher', label: '教师', risk: 'medium', multiplier: 0.9 },
  { value: 'security_guard', label: '保安', risk: 'low', multiplier: 2.0 },
  { value: 'chef', label: '厨师', risk: 'low', multiplier: 1.5 },
  { value: 'plumber', label: '水管工', risk: 'low', multiplier: 1.8 },
  { value: 'electrician', label: '电工', risk: 'low', multiplier: 1.7 },
  { value: 'construction_worker', label: '建筑工人', risk: 'low', multiplier: 2.2 },
  { value: 'driver', label: '司机', risk: 'high', multiplier: 0.4 },
  { value: 'salesperson', label: '销售员', risk: 'medium', multiplier: 0.8 },
  { value: 'manager', label: '管理人员', risk: 'medium', multiplier: 0.9 },
  { value: 'researcher', label: '研究员', risk: 'high', multiplier: 0.35 },
  { value: 'artist', label: '艺术家', risk: 'low', multiplier: 1.3 },
  { value: 'musician', label: '音乐家', risk: 'low', multiplier: 1.4 },
  { value: 'psychologist', label: '心理咨询师', risk: 'low', multiplier: 1.6 },
  { value: 'social_worker', label: '社工', risk: 'low', multiplier: 1.5 },
  { value: 'other', label: '其他职业', risk: 'medium', multiplier: 1.0 },
];

const UserInputDialog = ({ open, onOpenChange, onSubmit }: UserInputDialogProps) => {
  const [nickname, setNickname] = useState('');
  const [occupation, setOccupation] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleOccupationChange = (value: string) => {
    setOccupation(value);
    const occ = OCCUPATIONS.find(o => o.value === value);
    if (occ) {
      generateAnalysis(occ);
    }
  };

  const generateAnalysis = async (occ: typeof OCCUPATIONS[0]) => {
    setLoading(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const riskTexts: Record<string, string> = {
      high: '极高风险',
      medium: '中等风险',
      low: '相对安全'
    };

    const analysisText = `AI分析完成：${occ.label}岗位面临${riskTexts[occ.risk]}的自动化替代威胁。基于当前AI发展速度，该职业预计将在基础AGI实现前${occ.multiplier > 1 ? '后' : ''}${Math.abs(Math.round((1 - occ.multiplier) * 10))}年受到显著影响。`;
    
    setAnalysis(analysisText);
    setLoading(false);
  };

  const handleSubmit = () => {
    if (!nickname || !occupation) return;
    
    const occ = OCCUPATIONS.find(o => o.value === occupation);
    if (!occ) return;

    // Calculate personal countdown based on occupation
    const baseYears = 14;
    const baseMonths = 3;
    const baseDays = 2;
    
    const personalYears = Math.round(baseYears * occ.multiplier);
    const personalMonths = Math.round(baseMonths * occ.multiplier);
    const personalDays = Math.round(baseDays * occ.multiplier);

    onSubmit({
      nickname,
      occupation: occ.label,
      countdown: {
        years: personalYears,
        months: personalMonths,
        days: personalDays
      }
    });
    
    onOpenChange(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-oracle-red';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-white/60';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-oracle-red" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Brain className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const selectedOcc = OCCUPATIONS.find(o => o.value === occupation);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-oracle-gray1 border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-thunder text-2xl text-white">
            AI职业风险评估
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="font-manrope text-sm text-white/60">您的昵称</Label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="输入昵称"
              className="bg-black/50 border-white/20 text-white placeholder:text-white/30"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-manrope text-sm text-white/60">选择职业</Label>
            <Select value={occupation} onValueChange={handleOccupationChange}>
              <SelectTrigger className="bg-black/50 border-white/20 text-white">
                <SelectValue placeholder="选择您的职业" />
              </SelectTrigger>
              <SelectContent className="bg-oracle-gray1 border-white/20 max-h-64">
                {OCCUPATIONS.map((occ) => (
                  <SelectItem 
                    key={occ.value} 
                    value={occ.value}
                    className="text-white hover:bg-white/10"
                  >
                    <div className="flex items-center gap-2">
                      {getRiskIcon(occ.risk)}
                      <span>{occ.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 className="w-5 h-5 text-oracle-red animate-spin" />
              <span className="font-manrope text-sm text-white/60">AI分析中...</span>
            </div>
          )}

          {analysis && selectedOcc && (
            <div className="p-4 bg-oracle-red/10 border border-oracle-red/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-oracle-red" />
                <span className="font-manrope text-xs text-oracle-red uppercase tracking-wider">
                  AI分析结果
                </span>
              </div>
              <p className="font-manrope text-sm text-white/80">{analysis}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="font-manrope text-xs text-white/40">风险等级:</span>
                <span className={`font-manrope text-xs font-medium ${getRiskColor(selectedOcc.risk)}`}>
                  {selectedOcc.risk === 'high' ? '极高风险' : selectedOcc.risk === 'medium' ? '中等风险' : '相对安全'}
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!nickname || !occupation || loading}
            className="w-full bg-oracle-red hover:bg-oracle-red/80 text-white disabled:opacity-50"
          >
            生成我的倒计时
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserInputDialog;
