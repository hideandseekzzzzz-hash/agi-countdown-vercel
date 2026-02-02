/**
 * 获取职业列表API
 * GET /api/occupations
 */

const { getOccupations } = require('../lib/data-fetcher');

export default function handler(req, res) {
  try {
    const occupations = getOccupations();
    res.status(200).json(occupations);
  } catch (error) {
    console.error('Occupations API error:', error);
    res.status(500).json({ error: 'Failed to fetch occupations' });
  }
}
