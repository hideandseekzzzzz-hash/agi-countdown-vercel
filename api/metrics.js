/**
 * 获取实时指标API
 * GET /api/metrics
 */

const { analyzeMetricWithGLM4 } = require('../lib/glm4');
const { metricsCache } = require('../lib/cache');

export default async function handler(req, res) {
  try {
    // 检查缓存
    const cached = metricsCache.get('metrics');
    if (cached) {
      return res.status(200).json(cached);
    }

    // 基础数据（模拟实时计算）
    const baseCompute = 847.5;
    const daysSince2024 = (Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24);
    const computeValue = (baseCompute * Math.pow(1.0002, daysSince2024)).toFixed(1);

    // 使用GLM-4生成分析（并行执行以节省时间）
    const [computeAnalysis, energyAnalysis, paramAnalysis, datasetAnalysis] = await Promise.all([
      analyzeMetricWithGLM4('计算增长', computeValue, '+23.4%'),
      analyzeMetricWithGLM4('训练能耗', '128.7', '+15.2%'),
      analyzeMetricWithGLM4('参数指数', '1.8', '+45.8%'),
      analyzeMetricWithGLM4('数据集规模', '45.2', '+18.9%')
    ]);

    const metrics = {
      compute: {
        value: computeValue,
        unit: 'PFLOPS',
        change: '+23.4%',
        aiAnalysis: computeAnalysis
      },
      energy: {
        value: (128.7 + Math.random() * 5).toFixed(1),
        unit: 'MWh',
        change: '+15.2%',
        aiAnalysis: energyAnalysis
      },
      parameters: {
        value: (1.8 + Math.random() * 0.2).toFixed(1),
        unit: 'T',
        change: '+45.8%',
        aiAnalysis: paramAnalysis
      },
      dataset: {
        value: (45.2 + Math.random() * 3).toFixed(1),
        unit: 'PB',
        change: '+18.9%',
        aiAnalysis: datasetAnalysis
      },
      timestamp: new Date().toISOString()
    };

    // 缓存结果
    metricsCache.set('metrics', metrics);

    res.status(200).json(metrics);
  } catch (error) {
    console.error('Metrics API error:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
}
