/**
 * GET /api/prediction
 * Build a live AGI date estimate from fresh AI news signals.
 */

const { callGLM4 } = require('../lib/glm4');
const { metricsCache } = require('../lib/cache');
const {
  fetchArxivPapers,
  fetchGitHubTrending,
  generateAINewsWithGLM4,
  generateDefaultNews
} = require('../lib/data-fetcher');

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toCountdown(estimatedDate) {
  const now = new Date();
  const target = new Date(estimatedDate);
  const safeTarget = target > now ? target : now;

  let years = safeTarget.getFullYear() - now.getFullYear();
  let months = safeTarget.getMonth() - now.getMonth();
  let days = safeTarget.getDate() - now.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(
      safeTarget.getFullYear(),
      safeTarget.getMonth(),
      0
    ).getDate();
    days += prevMonthDays;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days)
  };
}

function buildNewsPulse(newsItems) {
  const keywordWeights = {
    breakthrough: 8,
    autonomous: 7,
    superintelligence: 10,
    reasoning: 6,
    agent: 5,
    multimodal: 4,
    robotics: 4,
    acceleration: 6,
    alignment: -3,
    regulation: -2,
    safety: -2
  };

  let score = 0;

  for (const item of newsItems) {
    const title = String(item.title || '').toLowerCase();
    const priority = String(item.priority || 'low').toLowerCase();

    if (priority === 'high') score += 8;
    else if (priority === 'medium') score += 4;
    else score += 1;

    for (const [word, weight] of Object.entries(keywordWeights)) {
      if (title.includes(word)) {
        score += weight;
      }
    }
  }

  return clamp(Math.round(score / Math.max(newsItems.length, 1) + 50), 20, 95);
}

async function buildAIPredictionAnalysis(input) {
  const prompt = `
You are forecasting AGI timeline using fresh AI signals.
NewsPulse score: ${input.newsPulse}/100
High priority news count: ${input.highPriority}
Raw signal count: ${input.rawSignalCount}
Estimated AGI date: ${input.estimatedDate}
Confidence: ${input.confidence}%

Return JSON:
{
  "factors": ["factor1","factor2","factor3"],
  "aiAnalysis": "max 120 words, concise"
}
`;

  try {
    const response = await callGLM4(prompt, 0.5);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('GLM-4 live prediction analysis failed:', error.message);
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const cached = metricsCache.get('prediction_live');
    if (cached) {
      return res.status(200).json(cached);
    }

    const [arxivPapers, githubRepos] = await Promise.all([
      fetchArxivPapers(),
      fetchGitHubTrending()
    ]);

    const rawNews = [
      ...arxivPapers.slice(0, 6).map((p) => ({
        title: p.title,
        source: 'arXiv',
        type: 'paper'
      })),
      ...githubRepos.slice(0, 6).map((r) => ({
        title: r.name,
        source: 'GitHub',
        type: 'repo'
      }))
    ];

    let aiNews;
    try {
      aiNews = await generateAINewsWithGLM4(rawNews);
    } catch (error) {
      console.error('generateAINewsWithGLM4 failed:', error.message);
      aiNews = generateDefaultNews();
    }

    if (!Array.isArray(aiNews) || aiNews.length === 0) {
      aiNews = generateDefaultNews();
    }

    const normalizedNews = aiNews.slice(0, 10).map((item) => ({
      title: item.title || '',
      priority: item.priority || 'low'
    }));

    const newsPulse = buildNewsPulse(normalizedNews);
    const highPriority = normalizedNews.filter((n) => n.priority === 'high').length;
    const rawSignalCount = rawNews.length;

    const baselineDate = new Date('2038-06-15T00:00:00Z');
    const pulseShiftDays = Math.round((newsPulse - 50) * 18);
    const densityShiftDays = highPriority * 7 + rawSignalCount * 2;
    baselineDate.setDate(baselineDate.getDate() - pulseShiftDays - densityShiftDays);

    const estimatedDate = baselineDate.toISOString().split('T')[0];
    const confidence = clamp(
      Math.round(45 + newsPulse * 0.45 + highPriority * 2),
      35,
      95
    );

    let aiPart = await buildAIPredictionAnalysis({
      newsPulse,
      highPriority,
      rawSignalCount,
      estimatedDate,
      confidence
    });

    if (!aiPart || !Array.isArray(aiPart.factors) || !aiPart.aiAnalysis) {
      aiPart = {
        factors: [
          'Research publication velocity',
          'Model capability jumps',
          'Compute and infrastructure expansion',
          'Deployment speed in production systems'
        ],
        aiAnalysis:
          'The estimate is recalculated from live news intensity and signal density. A denser stream of high-priority breakthroughs shifts the projected AGI date earlier, while weaker momentum pushes it later.'
      };
    }

    const result = {
      estimatedDate,
      confidence,
      factors: aiPart.factors.slice(0, 5),
      aiAnalysis: aiPart.aiAnalysis,
      countdown: toCountdown(estimatedDate),
      newsPulse,
      signalStats: {
        highPriority,
        rawSignalCount
      },
      lastUpdated: new Date().toISOString()
    };

    metricsCache.set('prediction_live', result, 120000);
    res.status(200).json(result);
  } catch (error) {
    console.error('Prediction API error:', error);

    const fallbackDate = '2038-06-15';
    res.status(200).json({
      estimatedDate: fallbackDate,
      confidence: 67,
      factors: [
        'Research publication velocity',
        'Model capability jumps',
        'Compute and infrastructure expansion'
      ],
      aiAnalysis:
        'Fallback estimate is active because live signal aggregation failed for this request.',
      countdown: toCountdown(fallbackDate),
      newsPulse: 50,
      signalStats: {
        highPriority: 0,
        rawSignalCount: 0
      },
      lastUpdated: new Date().toISOString()
    });
  }
}
