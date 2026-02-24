// AI data service for live metrics/news/prediction APIs

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

interface ApiNewsItem {
  id?: number;
  title?: string;
  priority?: 'high' | 'medium' | 'low';
  timestamp?: string;
  aiSummary?: string;
  source?: string;
}

export interface SingularityPrediction {
  estimatedDate: string;
  confidence: number;
  factors: string[];
  aiAnalysis: string;
  countdown: {
    years: number;
    months: number;
    days: number;
  };
  newsPulse: number;
  signalStats: {
    highPriority: number;
    rawSignalCount: number;
  };
  lastUpdated: string;
}

export interface OccupationRisk {
  occupation: string;
  riskLevel: 'high' | 'medium' | 'low';
  replacementTimeline: string;
  aiAnalysis: string;
  affectedTasks: string[];
  safeTasks: string[];
}

export const getAIAnalyzedMetrics = async (): Promise<MetricData[]> => {
  try {
    const response = await fetch('/api/metrics');
    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }

    const data = await response.json();
    return [
      {
        title: 'Compute Growth',
        value: data.compute.value,
        unit: data.compute.unit,
        change: data.compute.change,
        trend: 'up',
        aiAnalysis: data.compute.aiAnalysis
      },
      {
        title: 'Training Energy',
        value: data.energy.value,
        unit: data.energy.unit,
        change: data.energy.change,
        trend: 'up',
        aiAnalysis: data.energy.aiAnalysis
      },
      {
        title: 'Parameter Scale',
        value: data.parameters.value,
        unit: data.parameters.unit,
        change: data.parameters.change,
        trend: 'up',
        aiAnalysis: data.parameters.aiAnalysis
      },
      {
        title: 'Dataset Scale',
        value: data.dataset.value,
        unit: data.dataset.unit,
        change: data.dataset.change,
        trend: 'up',
        aiAnalysis: data.dataset.aiAnalysis
      }
    ];
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    return [
      {
        title: 'Compute Growth',
        value: '847.2',
        unit: 'PFLOPS',
        change: '+22.5%',
        trend: 'up',
        aiAnalysis: 'Live metrics unavailable. Showing fallback values.'
      },
      {
        title: 'Training Energy',
        value: '132.1',
        unit: 'MWh',
        change: '+11.3%',
        trend: 'up',
        aiAnalysis: 'Live metrics unavailable. Showing fallback values.'
      },
      {
        title: 'Parameter Scale',
        value: '1.9',
        unit: 'T',
        change: '+43.8%',
        trend: 'up',
        aiAnalysis: 'Live metrics unavailable. Showing fallback values.'
      },
      {
        title: 'Dataset Scale',
        value: '47',
        unit: 'PB',
        change: '+17.2%',
        trend: 'up',
        aiAnalysis: 'Live metrics unavailable. Showing fallback values.'
      }
    ];
  }
};

export const getAICuratedNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await fetch('/api/news');
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();
    return (data as ApiNewsItem[]).map((item, index: number) => ({
      id: item.id || index + 1,
      text: item.title || 'Untitled',
      priority: (item.priority || 'low') as 'high' | 'medium' | 'low',
      timestamp: item.timestamp || new Date().toISOString(),
      aiSummary: item.aiSummary || 'No summary',
      source: item.source || 'Live AI Feed'
    }));
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [
      {
        id: 1,
        text: 'Live news stream unavailable',
        priority: 'medium',
        timestamp: new Date().toISOString().split('T')[1].split('.')[0],
        aiSummary: 'The service will resume automatically.',
        source: 'System'
      }
    ];
  }
};

export const getSingularityPrediction = async (): Promise<SingularityPrediction> => {
  try {
    const response = await fetch('/api/prediction');
    if (!response.ok) {
      throw new Error('Failed to fetch prediction');
    }

    const data = await response.json();
    return {
      estimatedDate: data.estimatedDate,
      confidence: data.confidence,
      factors: Array.isArray(data.factors) ? data.factors : [],
      aiAnalysis: data.aiAnalysis || '',
      countdown: data.countdown || { years: 14, months: 3, days: 2 },
      newsPulse: data.newsPulse ?? 50,
      signalStats: data.signalStats || { highPriority: 0, rawSignalCount: 0 },
      lastUpdated: data.lastUpdated || new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch prediction:', error);
    return {
      estimatedDate: '2038-06-15',
      confidence: 67,
      factors: [
        'Research publication velocity',
        'Model capability jumps',
        'Compute and infrastructure expansion'
      ],
      aiAnalysis: 'Prediction service unavailable. Showing fallback estimate.',
      countdown: { years: 14, months: 3, days: 2 },
      newsPulse: 50,
      signalStats: { highPriority: 0, rawSignalCount: 0 },
      lastUpdated: new Date().toISOString()
    };
  }
};

export const assessOccupationRisk = async (occupation: string): Promise<OccupationRisk> => {
  try {
    const response = await fetch('/api/occupation-risk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    return {
      occupation: 'Unknown',
      riskLevel: 'medium',
      replacementTimeline: '8-12 years',
      aiAnalysis: 'Risk service unavailable. Showing fallback estimate.',
      affectedTasks: ['Routine tasks'],
      safeTasks: ['Creative work', 'Human interaction']
    };
  }
};

export const subscribeToDataStream = (
  callback: (data: { type: string; data: MetricData[]; timestamp: string }) => void
) => {
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
