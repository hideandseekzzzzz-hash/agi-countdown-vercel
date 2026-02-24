/**
 * GET /api/metrics
 * Generate live metrics that respond to current signal intensity.
 */

const { analyzeMetricWithGLM4 } = require('../lib/glm4');
const { metricsCache } = require('../lib/cache');
const { fetchArxivPapers, fetchGitHubTrending } = require('../lib/data-fetcher');

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

export default async function handler(req, res) {
  try {
    const cached = metricsCache.get('metrics_live');
    if (cached) {
      return res.status(200).json(cached);
    }

    const [papers, repos] = await Promise.all([
      fetchArxivPapers(),
      fetchGitHubTrending()
    ]);

    const now = Date.now();
    const minuteWave = Math.sin(now / 60000);
    const shortWave = Math.cos(now / 12000);

    const papersCount = papers.length || 1;
    const reposCount = repos.length || 1;
    const avgRepoStars = reposCount
      ? repos.reduce((sum, repo) => sum + (repo.stars || 0), 0) / reposCount
      : 0;

    const signalStrength = clamp(
      papersCount * 2 + reposCount * 1.5 + avgRepoStars / 3000,
      10,
      80
    );

    const computeValueNum =
      760 + signalStrength * 1.9 + minuteWave * 18 + shortWave * 7;
    const energyValueNum = 120 + signalStrength * 0.55 + shortWave * 2.5;
    const paramValueNum = 1.2 + signalStrength * 0.018 + minuteWave * 0.06;
    const datasetValueNum = 42 + signalStrength * 0.75 + minuteWave * 2.2;

    const computeValue = round1(computeValueNum).toFixed(1);
    const energyValue = round1(energyValueNum).toFixed(1);
    const paramValue = round1(paramValueNum).toFixed(1);
    const datasetValue = Math.round(datasetValueNum).toString();

    const computeChange = `+${(8 + signalStrength * 0.2 + minuteWave * 1.2).toFixed(1)}%`;
    const energyChange = `+${(5 + signalStrength * 0.14 + shortWave).toFixed(1)}%`;
    const paramChange = `+${(12 + signalStrength * 0.25 + minuteWave * 1.8).toFixed(1)}%`;
    const datasetChange = `+${(7 + signalStrength * 0.16 + shortWave * 1.3).toFixed(1)}%`;

    const [computeAnalysis, energyAnalysis, paramAnalysis, datasetAnalysis] =
      await Promise.all([
        analyzeMetricWithGLM4('Compute growth', computeValue, computeChange),
        analyzeMetricWithGLM4('Training energy', energyValue, energyChange),
        analyzeMetricWithGLM4('Parameter scale', paramValue, paramChange),
        analyzeMetricWithGLM4('Dataset scale', datasetValue, datasetChange)
      ]);

    const metrics = {
      compute: {
        value: computeValue,
        unit: 'PFLOPS',
        change: computeChange,
        aiAnalysis: computeAnalysis
      },
      energy: {
        value: energyValue,
        unit: 'MWh',
        change: energyChange,
        aiAnalysis: energyAnalysis
      },
      parameters: {
        value: paramValue,
        unit: 'T',
        change: paramChange,
        aiAnalysis: paramAnalysis
      },
      dataset: {
        value: datasetValue,
        unit: 'PB',
        change: datasetChange,
        aiAnalysis: datasetAnalysis
      },
      signalStats: {
        papersCount,
        reposCount,
        avgRepoStars: Math.round(avgRepoStars)
      },
      timestamp: new Date().toISOString()
    };

    metricsCache.set('metrics_live', metrics, 30000);
    res.status(200).json(metrics);
  } catch (error) {
    console.error('Metrics API error:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
}
