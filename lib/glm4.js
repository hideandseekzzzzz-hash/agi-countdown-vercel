/**
 * GLM-4 云API调用库
 * 使用智谱AI开放平台的API
 */

const axios = require('axios');

const GLM4_API_URL = process.env.GLM4_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const GLM4_API_KEY = process.env.GLM4_API_KEY;
const GLM4_MODEL = process.env.GLM4_MODEL || 'glm-4';

/**
 * 调用GLM-4云API
 * @param {string} prompt - 提示词
 * @param {number} temperature - 温度参数 (0-1)
 * @returns {Promise<string>} - API响应内容
 */
async function callGLM4(prompt, temperature = 0.7) {
  if (!GLM4_API_KEY) {
    console.warn('GLM4_API_KEY not set, using fallback analysis');
    return generateFallbackAnalysis(prompt);
  }

  try {
    const response = await axios.post(
      GLM4_API_URL,
      {
        model: GLM4_MODEL,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的AI发展分析师，擅长分析技术趋势和预测未来。请用简洁专业的中文回答。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${GLM4_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 8000 // 8秒超时，确保在Vercel限制内
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('GLM-4 API error:', error.message);
    // 返回备用分析
    return generateFallbackAnalysis(prompt);
  }
}

/**
 * GLM-4不可用时返回备用分析
 * @param {string} prompt - 原始提示词
 * @returns {string} - 备用分析文本
 */
function generateFallbackAnalysis(prompt) {
  if (prompt.includes('计算增长')) {
    return 'AI计算能力呈指数级增长，主要受大型语言模型训练需求驱动。预计18个月内将突破1EFLOPS里程碑。';
  }
  if (prompt.includes('训练能耗')) {
    return '训练能耗持续攀升，但单位算力能耗比正在优化。新型冷却技术可将能效提升40%。';
  }
  if (prompt.includes('参数')) {
    return '模型参数规模突破万亿级别。研究表明参数增长与涌现能力存在非线性关系。';
  }
  if (prompt.includes('数据集')) {
    return '高质量训练数据成为稀缺资源。合成数据和多模态数据正在填补缺口。';
  }
  if (prompt.includes('职业') || prompt.includes('风险')) {
    return '基于当前技术发展趋势分析，该岗位面临中等程度的自动化风险。';
  }
  return '基于当前数据趋势分析，该指标呈现稳定增长态势。';
}

/**
 * 使用GLM-4分析指标趋势
 * @param {string} metricName - 指标名称
 * @param {string} value - 当前数值
 * @param {string} trend - 变化趋势
 * @returns {Promise<string>} - AI分析文本
 */
async function analyzeMetricWithGLM4(metricName, value, trend) {
  const prompt = `
作为AI发展分析师，请分析以下指标：

指标名称：${metricName}
当前数值：${value}
变化趋势：${trend}

请用50字以内给出专业分析，说明这个指标对AGI发展的意义。
`;

  return await callGLM4(prompt, 0.6);
}

module.exports = {
  callGLM4,
  generateFallbackAnalysis,
  analyzeMetricWithGLM4
};
