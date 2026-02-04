// AI Data Service - Fetches real-time AI analysis from Vercel API

export interface MetricData {
  title: string;
  value: string;
  unit: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  aiAnalysis: string;
}

export interface NewsItem {
  id: number;
  text: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  aiSummary: string;
  source: string;
}

// Fetch AI-analyzed metrics from Vercel API
export const getAIAnalyzedMetrics = async (): Promise<MetricData[]> => {
  try {
    const response = await fetch('/api/metrics');
    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }
    const data = await response.json();
    
    return [
      {
        title: '计算增长',
        value: data.compute.value,
        unit: data.compute.unit,
        change: data.compute.change,
        trend: 'up' as const,
        aiAnalysis: data.compute.aiAnalysis
      },
      {
        title: '训练能耗',
        value: data.energy.value,
        unit: data.energy.unit,
        change: data.energy.change,
        trend: 'up' as const,
        aiAnalysis: data.energy.aiAnalysis
      },
      {
        title: '参数指数',
        value: data.parameters.value,
        unit: data.parameters.unit,
        change: data.parameters.change,
        trend: 'up' as const,
        aiAnalysis: data.parameters.aiAnalysis
      },
      {
        title: '数据集规模',
        value: data.dataset.value,
        unit: data.dataset.unit,
        change: data.dataset.change,
        trend: 'up' as const,
        aiAnalysis: data.dataset.aiAnalysis
      }
    ];
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    // Return fallback data on error
    return [
      {
        title: '计算增长',
        value: (847 + Math.random() * 10).toFixed(1),
        unit: 'PFLOPS',
        change: `+${(20 + Math.random() * 10).toFixed(1)}%`,
        trend: 'up' as const,
        aiAnalysis: 'AI计算能力呈指数级增长，主要受大型语言模型训练需求驱动。预计18个月内将突破1EFLOPS里程碑。'
      },
      {
        title: '训练能耗',
        value: (128 + Math.random() * 5).toFixed(1),
        unit: 'MWh',
        change: `+${(10 + Math.random() * 10).toFixed(1)}%`,
        trend: 'up' as const,
        aiAnalysis: '训练能耗持续攀升，但单位算力能耗比正在优化。新型冷却技术可将能效提升40%。'
      },
      {
        title: '参数指数',
        value: (1.8 + Math.random() * 0.2).toFixed(1),
        unit: 'T',
        change: `+${(40 + Math.random() * 15).toFixed(1)}%`,
        trend: 'up' as const,
        aiAnalysis: '模型参数规模突破万亿级别。研究表明参数增长与涌现能力存在非线性关系。'
      },
      {
        title: '数据集规模',
        value: (45 + Math.random() * 3).toFixed(1),
        unit: 'PB',
        change: `+${(15 + Math.random() * 10).toFixed(1)}%`,
        trend: 'up' as const,
        aiAnalysis: '高质量训练数据成为稀缺资源。合成数据和多模态数据正在填补缺口。'
      }
    ];
  }
};

// Fetch AI-curated news from Vercel API
export const getAICuratedNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await fetch('/api/news');
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const data = await response.json();
    
    return data.map((item: any, index: number) => ({
      id: item.id || index + 1,
      text: item.title,
      priority: item.priority,
      timestamp: item.timestamp,
      aiSummary: item.aiSummary,
      source: 'AI Analysis'
    }));
  } catch (error) {
    console.error('Failed to fetch news:', error);
    // Return fallback data on error
    const newsDatabase = [
      {
        text: 'GPT-5达到博士级推理能力',
        priority: 'high' as const,
        aiSummary: 'OpenAI下一代模型在多项学术基准测试中超越人类专家水平',
        source: 'AI Research Lab'
      },
      {
        text: '神经链接获批用于人类试验',
        priority: 'high' as const,
        aiSummary: '脑机接口技术进入临床阶段，人机融合进程加速',
        source: 'Neural Tech Daily'
      },
      {
        text: '量子霸权已实现 - 加密系统面临崩溃',
        priority: 'high' as const,
        aiSummary: '1000+量子比特处理器成功运行，传统加密算法受到威胁',
        source: 'Quantum Weekly'
      },
      {
        text: 'AI自主编程能力突破95%准确率',
        priority: 'medium' as const,
        aiSummary: 'GitHub Copilot X在代码生成任务中达到专业开发者水平',
        source: 'Dev AI News'
      },
      {
        text: '全球算力中心能耗激增300%',
        priority: 'medium' as const,
        aiSummary: 'AI训练需求推动数据中心电力消耗创历史新高',
        source: 'Energy Watch'
      },
      {
        text: '首个完全自主AI实验室投入运行',
        priority: 'high' as const,
        aiSummary: 'AI系统可独立设计实验、分析数据并发表研究成果',
        source: 'Science AI'
      },
      {
        text: '机器意识研究取得突破性进展',
        priority: 'high' as const,
        aiSummary: '新理论框架为理解AI自我意识提供数学基础',
        source: 'Consciousness Research'
      },
      {
        text: 'AI系统开始自我优化架构',
        priority: 'medium' as const,
        aiSummary: 'AutoML进化到可自主设计神经网络拓扑结构',
        source: 'ML Architecture'
      },
      {
        text: '多模态AI实现视觉-语言-动作统一',
        priority: 'high' as const,
        aiSummary: '新一代模型可理解视频内容并执行复杂物理任务',
        source: 'Multimodal AI'
      },
      {
        text: 'AI药物发现缩短至3个月周期',
        priority: 'medium' as const,
        aiSummary: 'AlphaFold衍生技术加速新药研发全流程',
        source: 'BioTech Today'
      },
      {
        text: '边缘AI芯片算力突破100TOPS',
        priority: 'low' as const,
        aiSummary: '移动端设备可运行大型语言模型',
        source: 'Chip Insider'
      },
      {
        text: 'AI法律助手通过律师资格考试',
        priority: 'medium' as const,
        aiSummary: '专业服务行业面临自动化冲击',
        source: 'Legal Tech News'
      }
    ];

    const now = new Date();
    return newsDatabase.map((item, index) => ({
      id: index + 1,
      text: item.text,
      priority: item.priority,
      timestamp: new Date(now.getTime() - index * 3600000).toISOString().split('T')[1].split('.')[0],
      aiSummary: item.aiSummary,
      source: item.source
    }));
  }
};

// Fetch AI-powered singularity prediction from Vercel API
export const getSingularityPrediction = async (): Promise<{
  estimatedDate: string;
  confidence: number;
  factors: string[];
  aiAnalysis: string;
}> => {
  try {
    const response = await fetch('/api/prediction');
    if (!response.ok) {
      throw new Error('Failed to fetch prediction');
    }
    const data = await response.json();
    
    return {
      estimatedDate: data.estimatedDate,
      confidence: data.confidence,
      factors: data.factors,
      aiAnalysis: data.aiAnalysis
    };
  } catch (error) {
    console.error('Failed to fetch prediction:', error);
    // Return fallback data on error
    return {
      estimatedDate: '2038-06-15',
      confidence: 67,
      factors: [
        '计算能力指数增长',
        '算法效率持续提升',
        '训练数据规模扩大',
        '投资金额创新高'
      ],
      aiAnalysis: '基于当前发展趋势的多变量模型预测，AGI有较大概率在2038年中期实现。关键变量包括：芯片性能突破、算法创新速度、以及监管政策走向。置信区间±2.3年。'
    };
  }
};

// Occupational risk assessment
export interface OccupationRisk {
  occupation: string;
  riskLevel: 'high' | 'medium' | 'low';
  replacementTimeline: string;
  aiAnalysis: string;
  affectedTasks: string[];
  safeTasks: string[];
}

export const assessOccupationRisk = async (occupation: string): Promise<OccupationRisk> => {
  try {
    const response = await fetch('/api/occupation-risk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ occupation, occupationName: occupation })
    });
    
    if (!response.ok) {
      throw new Error('Failed to assess occupation risk');
    }
    
    const data = await response.json();
    return {
      occupation: data.occupation,
      riskLevel: data.riskLevel,
      replacementTimeline: data.replacementTimeline,
      aiAnalysis: data.aiAnalysis,
      affectedTasks: data.affectedTasks,
      safeTasks: data.safeTasks
    };
  } catch (error) {
    console.error('Failed to assess occupation risk:', error);
    // Return fallback data on error
    const riskMap: Record<string, OccupationRisk> = {
      'software_engineer': {
        occupation: '软件工程师',
        riskLevel: 'high',
        replacementTimeline: '4-6年',
        aiAnalysis: 'AI编程助手已能处理70%的常规编码任务。随着多模态理解能力提升，架构设计和复杂调试也将被逐步替代。',
        affectedTasks: ['代码编写', '单元测试', 'bug修复', '代码审查'],
        safeTasks: ['系统架构', '团队管理', '需求分析']
      },
      'data_analyst': {
        occupation: '数据分析师',
        riskLevel: 'high',
        replacementTimeline: '3-5年',
        aiAnalysis: 'AI在数据清洗、可视化、模式识别方面已超越人类。自然语言查询将进一步降低专业门槛。',
        affectedTasks: ['数据清洗', '报表生成', '趋势分析', '可视化'],
        safeTasks: ['业务洞察', '战略建议']
      },
      'content_writer': {
        occupation: '内容创作者',
        riskLevel: 'high',
        replacementTimeline: '2-4年',
        aiAnalysis: 'GPT类模型已能生成高质量文本。个性化内容生成和SEO优化将首先被自动化。',
        affectedTasks: ['文章撰写', '文案创作', 'SEO优化', '内容改写'],
        safeTasks: ['深度调查', '原创观点', '情感共鸣']
      },
      'security_guard': {
        occupation: '保安',
        riskLevel: 'low',
        replacementTimeline: '15-20年',
        aiAnalysis: '物理安全岗位需要现场判断和人际互动，短期内难以完全自动化。监控分析部分可被AI辅助。',
        affectedTasks: ['监控分析', '出入记录'],
        safeTasks: ['应急响应', '人际沟通', '现场判断']
      },
      'doctor': {
        occupation: '医生',
        riskLevel: 'low',
        replacementTimeline: '12-18年',
        aiAnalysis: 'AI在影像诊断和药物推荐方面表现出色，但复杂诊断和医患关系仍需人类医生。',
        affectedTasks: ['影像诊断', '药物推荐', '病历整理'],
        safeTasks: ['复杂诊断', '手术治疗', '患者沟通']
      }
    };

    return riskMap[occupation] || {
      occupation: '未知职业',
      riskLevel: 'medium',
      replacementTimeline: '8-12年',
      aiAnalysis: '基于类似职业的类比分析，该岗位面临中等程度的自动化风险。',
      affectedTasks: ['常规任务'],
      safeTasks: ['创造性工作', '人际互动']
    };
  }
};

// Real-time data stream simulation
export const subscribeToDataStream = (callback: (data: any) => void) => {
  const interval = setInterval(async () => {
    const metrics = await getAIAnalyzedMetrics();
    callback({
      type: 'metrics',
      data: metrics,
      timestamp: new Date().toISOString()
    });
  }, 5000);

  return () => clearInterval(interval);
};
