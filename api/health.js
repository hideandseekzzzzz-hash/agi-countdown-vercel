/**
 * 健康检查API
 * GET /api/health
 */

export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    glm4: process.env.GLM4_API_KEY ? 'configured' : 'not configured'
  });
}
