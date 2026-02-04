/**
 * 获取AI新闻API
 * GET /api/news
 */

const { fetchArxivPapers, fetchGitHubTrending, generateAINewsWithGLM4, generateDefaultNews } = require('../lib/data-fetcher');
const { newsCache } = require('../lib/cache');

export default async function handler(req, res) {
  try {
    // 检查缓存
    const cached = newsCache.get('ai_news_processed');
    if (cached) {
      return res.status(200).json(cached);
    }

    // 获取原始数据（并行执行）
    const [arxivPapers, githubRepos] = await Promise.all([
      fetchArxivPapers(),
      fetchGitHubTrending()
    ]);

    // 准备原始数据用于GLM-4分析
    const rawNews = [
      ...arxivPapers.slice(0, 5).map(p => ({ title: p.title, source: 'arXiv', type: 'paper' })),
      ...githubRepos.slice(0, 5).map(r => ({ title: r.name, source: 'GitHub', type: 'repo' }))
    ];

    // 使用GLM-4生成预警新闻
    let aiNews;
    try {
      aiNews = await generateAINewsWithGLM4(rawNews);
    } catch (error) {
      console.error('GLM-4 news generation failed, using default:', error);
      aiNews = generateDefaultNews();
    }

    // 添加时间戳和ID
    const news = aiNews.map((item, index) => ({
      id: index + 1,
      ...item,
      timestamp: new Date(Date.now() - index * 3600000).toISOString().split('T')[1].split('.')[0]
    }));

    // 缓存结果
    newsCache.set('ai_news_processed', news);

    res.status(200).json(news);
  } catch (error) {
    console.error('News API error:', error);
    // 返回默认新闻作为备用
    const defaultNews = require('../lib/data-fetcher').generateDefaultNews();
    const news = defaultNews.map((item, index) => ({
      id: index + 1,
      ...item,
      timestamp: new Date(Date.now() - index * 3600000).toISOString().split('T')[1].split('.')[0]
    }));
    res.status(200).json(news);
  }
}
