/**
 * GET /api/news
 * Return source-first live news for the UI.
 */

const {
  fetchArxivPapers,
  fetchGitHubTrending,
  generateAINewsWithGLM4,
  generateDefaultNews
} = require('../lib/data-fetcher');
const { newsCache } = require('../lib/cache');

function classifyPriority(title) {
  const t = String(title || '').toLowerCase();
  const highKeywords = ['breakthrough', 'frontier', 'reasoning', 'agent', 'autonomous', 'agi', 'super'];
  const mediumKeywords = ['release', 'benchmark', 'open-source', 'paper', 'dataset', 'model'];

  if (highKeywords.some((k) => t.includes(k))) return 'high';
  if (mediumKeywords.some((k) => t.includes(k))) return 'medium';
  return 'low';
}

function toIsoOrNow(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

export default async function handler(req, res) {
  try {
    const cached = newsCache.get('news_source_first_v1');
    if (cached) {
      return res.status(200).json(cached);
    }

    const [arxivPapers, githubRepos] = await Promise.all([
      fetchArxivPapers(),
      fetchGitHubTrending()
    ]);

    const verifiedFromPapers = arxivPapers.slice(0, 6).map((paper, index) => ({
      id: index + 1,
      title: paper.title,
      priority: classifyPriority(paper.title),
      aiSummary: paper.summary || 'Latest research signal from arXiv.',
      source: 'arXiv',
      sourceUrl: paper.link || null,
      publishedAt: toIsoOrNow(paper.published),
      timestamp: toIsoOrNow(paper.published).split('T')[1].split('.')[0],
      isVerified: true
    }));

    const verifiedFromRepos = githubRepos.slice(0, 6).map((repo, index) => ({
      id: verifiedFromPapers.length + index + 1,
      title: repo.name,
      priority: classifyPriority(repo.name),
      aiSummary: repo.description || 'Trending engineering signal from GitHub.',
      source: 'GitHub',
      sourceUrl: repo.url || null,
      publishedAt: toIsoOrNow(repo.updated),
      timestamp: toIsoOrNow(repo.updated).split('T')[1].split('.')[0],
      isVerified: true
    }));

    const verifiedNews = [...verifiedFromPapers, ...verifiedFromRepos];

    const rawNewsForSynthesis = verifiedNews.slice(0, 10).map((item) => ({
      title: item.title,
      source: item.source,
      type: 'verified'
    }));

    let synthesized = [];
    try {
      const aiNews = await generateAINewsWithGLM4(rawNewsForSynthesis);
      synthesized = (Array.isArray(aiNews) ? aiNews : []).slice(0, 4).map((item, index) => ({
        id: verifiedNews.length + index + 1,
        title: item.title || 'AI synthesized signal',
        priority: item.priority || 'medium',
        aiSummary: item.aiSummary || 'Synthesized from multiple live sources.',
        source: 'AI Synthesis',
        sourceUrl: null,
        publishedAt: new Date().toISOString(),
        timestamp: new Date().toISOString().split('T')[1].split('.')[0],
        isVerified: false
      }));
    } catch (error) {
      console.error('GLM-4 synthesis failed:', error.message);
      synthesized = generateDefaultNews()
        .slice(0, 2)
        .map((item, index) => ({
          id: verifiedNews.length + index + 1,
          title: item.title,
          priority: item.priority || 'medium',
          aiSummary: item.aiSummary || 'Fallback synthesized signal.',
          source: 'AI Synthesis',
          sourceUrl: null,
          publishedAt: new Date().toISOString(),
          timestamp: new Date().toISOString().split('T')[1].split('.')[0],
          isVerified: false
        }));
    }

    const news = [...verifiedNews, ...synthesized]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 10)
      .map((item, index) => ({ ...item, id: index + 1 }));

    newsCache.set('news_source_first_v1', news, 45000);
    res.status(200).json(news);
  } catch (error) {
    console.error('News API error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}
