/**
 * 获取奇点预测API
 * GET /api/prediction
 */

const { callGLM4 } = require('../lib/glm4');
const { metricsCache } = require('../lib/cache');

export default async function handler(req, res) {
  try {
    // 检查缓存
    const cached = metricsCache.get('prediction');
    if (cached) {
      return res.status(200).json(cached);
    }

    const prompt = `
基于当前AI发展趋势，预测AGI（通用人工智能）的实现时间。
请给出：
1. 预计实现日期
2. 置信度百分比
3. 3-5个关键影响因素
4. 100字以内的分析说明

用JSON格式返回：
{
  "estimatedDate": "YYYY-MM-DD",
  "confidence": 数字,
  "factors": ["因素1", "因素2", ...],
  "aiAnalysis": "分析说明"
}`;

    let prediction;
    try {
      const response = await callGLM4(prompt, 0.7);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      prediction = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (error) {
      console.error('GLM-4 prediction failed, using default:', error);
    }

    // 使用默认预测
    if (!prediction) {
      prediction = {
        estimatedDate: '2038-06-15',
        confidence: 67,
        factors: ['计算能力指数增长', '算法效率提升', '数据规模扩大', '投资增加'],
        aiAnalysis: '基于当前发展趋势，AGI有较大概率在2038年实现。'
      };
    }

    const result = {
      ...prediction,
      lastUpdated: new Date().toISOString()
    };

    // 缓存结果（预测不需要频繁更新）
    metricsCache.set('prediction', result, 3600000); // 1小时缓存

    res.status(200).json(result);
  } catch (error) {
    console.error('Prediction API error:', error);
    res.status(500).json({
      estimatedDate: '2038-06-15',
      confidence: 67,
      factors: ['计算能力指数增长', '算法效率提升', '数据规模扩大', '投资增加'],
      aiAnalysis: '基于当前发展趋势，AGI有较大概率在2038年实现。',
      lastUpdated: new Date().toISOString()
    });
  }
}
