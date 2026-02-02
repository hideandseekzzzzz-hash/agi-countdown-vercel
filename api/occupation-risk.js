/**
 * 职业风险评估API
 * POST /api/occupation-risk
 */

const { occupationDB } = require('../lib/data-fetcher');

export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { occupation, occupationName } = req.body;

    if (!occupation || !occupationName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 从数据库获取职业信息
    const result = occupationDB[occupation] || occupationDB['other'];

    res.status(200).json({
      ...result,
      occupation: occupationName,
      affectedTasks: ['常规任务', '数据处理'],
      safeTasks: ['创造性工作', '人际互动', '复杂决策']
    });
  } catch (error) {
    console.error('Occupation risk API error:', error);
    res.status(500).json({ error: 'Failed to assess occupation risk' });
  }
}
