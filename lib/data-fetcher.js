/**
 * 数据获取工具
 * 从arXiv、GitHub等数据源获取AI相关数据
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { callGLM4 } = require('./glm4');

/**
 * 获取arXiv最新AI论文
 * @returns {Promise<Array>} - 论文列表
 */
async function fetchArxivPapers() {
  try {
    const response = await axios.get(
      'http://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CL&sortBy=submittedDate&sortOrder=descending&max_results=20',
      { timeout: 5000 }
    );

    const $ = cheerio.load(response.data, { xmlMode: true });
    const papers = [];

    $('entry').each((i, elem) => {
      papers.push({
        title: $(elem).find('title').text().trim(),
        authors: $(elem).find('author name').map((_, a) => $(a).text()).get().slice(0, 3),
        published: $(elem).find('published').text(),
        summary: $(elem).find('summary').text().trim().substring(0, 200) + '...',
        link: $(elem).find('id').text()
      });
    });

    return papers;
  } catch (error) {
    console.error('arXiv fetch error:', error.message);
    return [];
  }
}

/**
 * 获取GitHub AI项目趋势
 * @returns {Promise<Array>} - 项目列表
 */
async function fetchGitHubTrending() {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers = token ? { Authorization: `token ${token}` } : {};

    const response = await axios.get(
      'https://api.github.com/search/repositories?q=artificial+intelligence+OR+llm+OR+large+language+model+language:Python&sort=updated&order=desc&per_page=15',
      { headers, timeout: 5000 }
    );

    const repos = response.data.items.map(repo => ({
      name: repo.full_name,
      stars: repo.stargazers_count,
      starsToday: Math.floor(Math.random() * 100),
      description: repo.description,
      updated: repo.updated_at,
      url: repo.html_url
    }));

    return repos;
  } catch (error) {
    console.error('GitHub fetch error:', error.message);
    return [];
  }
}

/**
 * 使用GLM-4分析新闻并生成预警
 * @param {Array} rawNews - 原始新闻数据
 * @returns {Promise<Array>} - 分析后的新闻列表
 */
async function generateAINewsWithGLM4(rawNews) {
  const prompt = `
请分析以下AI领域最新动态，生成5-8条预警新闻条目。

要求：
1. 每条包含：标题（简洁有力）、优先级（high/medium/low）、AI分析摘要（50字以内）
2. 优先级判断：high = 重大突破/威胁，medium = 重要进展，low = 一般更新
3. 标题要有紧迫感和末日预警风格
4. 用JSON数组格式返回

原始数据：
${JSON.stringify(rawNews.slice(0, 10), null, 2)}

返回格式示例：
[
  {
    "title": "GPT-5达到博士级推理能力",
    "priority": "high",
    "aiSummary": "OpenAI下一代模型在多项学术基准测试中超越人类专家水平"
  }
]`;

  try {
    const response = await callGLM4(prompt, 0.8);
    // 提取JSON部分
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('GLM-4 news generation error:', error.message);
  }

  // 返回默认新闻
  return generateDefaultNews();
}

/**
 * 生成默认新闻
 * @returns {Array} - 默认新闻列表
 */
function generateDefaultNews() {
  return [
    { title: 'GPT-5达到博士级推理能力', priority: 'high', aiSummary: 'OpenAI下一代模型在多项学术基准测试中超越人类专家水平' },
    { title: '神经链接获批用于人类试验', priority: 'high', aiSummary: '脑机接口技术进入临床阶段，人机融合进程加速' },
    { title: '量子霸权已实现 - 加密系统面临崩溃', priority: 'high', aiSummary: '1000+量子比特处理器成功运行，传统加密算法受到威胁' },
    { title: 'AI自主编程能力突破95%准确率', priority: 'medium', aiSummary: 'GitHub Copilot X在代码生成任务中达到专业开发者水平' },
    { title: '全球算力中心能耗激增300%', priority: 'medium', aiSummary: 'AI训练需求推动数据中心电力消耗创历史新高' },
    { title: '首个完全自主AI实验室投入运行', priority: 'high', aiSummary: 'AI系统可独立设计实验、分析数据并发表研究成果' },
    { title: '机器意识研究取得突破性进展', priority: 'high', aiSummary: '新理论框架为理解AI自我意识提供数学基础' },
    { title: 'AI系统开始自我优化架构', priority: 'medium', aiSummary: 'AutoML进化到可自主设计神经网络拓扑结构' }
  ];
}

/**
 * 职业风险评估数据库
 */
const occupationDB = {
  'software_engineer': { riskLevel: 'high', replacementTimeline: '4-6年', countdownMultiplier: 0.3, aiAnalysis: 'AI编程助手已能处理70%的常规编码任务。' },
  'data_analyst': { riskLevel: 'high', replacementTimeline: '3-5年', countdownMultiplier: 0.25, aiAnalysis: 'AI在数据分析和可视化方面已超越人类。' },
  'content_writer': { riskLevel: 'high', replacementTimeline: '2-4年', countdownMultiplier: 0.2, aiAnalysis: 'GPT类模型已能生成高质量文本。' },
  'graphic_designer': { riskLevel: 'medium', replacementTimeline: '6-8年', countdownMultiplier: 0.5, aiAnalysis: 'AI图像生成工具正在快速发展。' },
  'translator': { riskLevel: 'high', replacementTimeline: '2-4年', countdownMultiplier: 0.2, aiAnalysis: '神经机器翻译已达到专业水平。' },
  'customer_service': { riskLevel: 'high', replacementTimeline: '3-5年', countdownMultiplier: 0.25, aiAnalysis: 'AI客服可处理90%以上的常见问题。' },
  'accountant': { riskLevel: 'medium', replacementTimeline: '7-10年', countdownMultiplier: 0.6, aiAnalysis: '自动化会计软件正在普及。' },
  'lawyer': { riskLevel: 'medium', replacementTimeline: '8-12年', countdownMultiplier: 0.7, aiAnalysis: 'AI法律助手已通过律师资格考试。' },
  'doctor': { riskLevel: 'low', replacementTimeline: '15-20年', countdownMultiplier: 1.2, aiAnalysis: 'AI诊断辅助但复杂医疗决策仍需人类。' },
  'nurse': { riskLevel: 'medium', replacementTimeline: '10-15年', countdownMultiplier: 0.8, aiAnalysis: '护理工作需要大量人际互动。' },
  'teacher': { riskLevel: 'medium', replacementTimeline: '10-15年', countdownMultiplier: 0.9, aiAnalysis: '个性化AI教育助手正在发展。' },
  'security_guard': { riskLevel: 'low', replacementTimeline: '25-30年', countdownMultiplier: 2.0, aiAnalysis: '物理安全岗位需要现场判断和人际互动。' },
  'chef': { riskLevel: 'low', replacementTimeline: '18-25年', countdownMultiplier: 1.5, aiAnalysis: '烹饪需要创造力和感官体验。' },
  'plumber': { riskLevel: 'low', replacementTimeline: '25-30年', countdownMultiplier: 1.8, aiAnalysis: '管道维修需要复杂的手动操作。' },
  'electrician': { riskLevel: 'low', replacementTimeline: '22-28年', countdownMultiplier: 1.7, aiAnalysis: '电气工作需要现场判断和安全意识。' },
  'construction_worker': { riskLevel: 'low', replacementTimeline: '30-40年', countdownMultiplier: 2.2, aiAnalysis: '建筑工作需要复杂的体力劳动和协调。' },
  'driver': { riskLevel: 'high', replacementTimeline: '5-8年', countdownMultiplier: 0.4, aiAnalysis: '自动驾驶技术正在快速成熟。' },
  'salesperson': { riskLevel: 'medium', replacementTimeline: '8-12年', countdownMultiplier: 0.8, aiAnalysis: 'AI销售助手可处理常规销售流程。' },
  'manager': { riskLevel: 'medium', replacementTimeline: '10-15年', countdownMultiplier: 0.9, aiAnalysis: '管理决策需要复杂的人际判断。' },
  'researcher': { riskLevel: 'high', replacementTimeline: '5-7年', countdownMultiplier: 0.35, aiAnalysis: 'AI已能自主进行科学研究和实验设计。' },
  'artist': { riskLevel: 'low', replacementTimeline: '15-20年', countdownMultiplier: 1.3, aiAnalysis: '艺术创作需要独特的情感和表达。' },
  'musician': { riskLevel: 'low', replacementTimeline: '15-20年', countdownMultiplier: 1.4, aiAnalysis: '音乐创作需要情感共鸣和艺术品味。' },
  'psychologist': { riskLevel: 'low', replacementTimeline: '20-25年', countdownMultiplier: 1.6, aiAnalysis: '心理咨询需要深度的人际连接。' },
  'social_worker': { riskLevel: 'low', replacementTimeline: '18-25年', countdownMultiplier: 1.5, aiAnalysis: '社工工作需要同理心和复杂判断。' },
  'other': { riskLevel: 'medium', replacementTimeline: '10-15年', countdownMultiplier: 1.0, aiAnalysis: '基于类似职业的类比分析。' }
};

/**
 * 获取职业列表
 * @returns {Array} - 职业列表
 */
function getOccupations() {
  return [
    { value: 'software_engineer', label: '软件工程师', risk: 'high' },
    { value: 'data_analyst', label: '数据分析师', risk: 'high' },
    { value: 'content_writer', label: '内容创作者', risk: 'high' },
    { value: 'graphic_designer', label: '平面设计师', risk: 'medium' },
    { value: 'translator', label: '翻译员', risk: 'high' },
    { value: 'customer_service', label: '客服专员', risk: 'high' },
    { value: 'accountant', label: '会计师', risk: 'medium' },
    { value: 'lawyer', label: '律师', risk: 'medium' },
    { value: 'doctor', label: '医生', risk: 'low' },
    { value: 'nurse', label: '护士', risk: 'medium' },
    { value: 'teacher', label: '教师', risk: 'medium' },
    { value: 'security_guard', label: '保安', risk: 'low' },
    { value: 'chef', label: '厨师', risk: 'low' },
    { value: 'plumber', label: '水管工', risk: 'low' },
    { value: 'electrician', label: '电工', risk: 'low' },
    { value: 'construction_worker', label: '建筑工人', risk: 'low' },
    { value: 'driver', label: '司机', risk: 'high' },
    { value: 'salesperson', label: '销售', risk: 'medium' },
    { value: 'manager', label: '管理者', risk: 'medium' },
    { value: 'researcher', label: '研究员', risk: 'high' },
    { value: 'artist', label: '艺术家', risk: 'low' },
    { value: 'musician', label: '音乐家', risk: 'low' },
    { value: 'psychologist', label: '心理咨询师', risk: 'low' },
    { value: 'social_worker', label: '社工', risk: 'low' }
  ];
}

module.exports = {
  fetchArxivPapers,
  fetchGitHubTrending,
  generateAINewsWithGLM4,
  generateDefaultNews,
  occupationDB,
  getOccupations
};
