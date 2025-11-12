export type TrendingTopic = {
  id: string;
  source: 'Reddit' | 'X';
  title: string;
  summary: string;
  tags: string[];
  community?: string;
  author?: string;
  url: string;
  baseScore: number;
};

export const trendingTopics: TrendingTopic[] = [
  {
    id: 'reddit-metabolic-flexibility',
    source: 'Reddit',
    community: 'r/BioHackers',
    title: '每天 5000 步 vs. 10000 步：对代谢灵活性的真实影响',
    summary:
      '一位 38 岁的创始人在连续 6 周对比步行强度后，发现 10,000 步与低剂量力量训练组合，能在 HRV 和空腹血糖上呈现最稳定的改善曲线。',
    tags: ['体重管理/减肥', '健身策略', '压力水平与皮质醇', '老化与长寿'],
    url: 'https://www.reddit.com/r/BioHackers/',
    baseScore: 4.6,
  },
  {
    id: 'reddit-cortisol-loop',
    source: 'Reddit',
    community: 'r/StressManagement',
    title: '用 3 分钟「体感扫描」打断皮质醇级联反应',
    summary:
      '神经科学家 Huberman 分享的 3 分钟体感扫描，在 14 天实验中让高压高管的晚间皮质醇下降 18%，同时改善睡眠潜伏期。',
    tags: ['压力水平与皮质醇', '人际关系焦虑', '睡眠与昼夜节律'],
    url: 'https://www.reddit.com/r/StressManagement/',
    baseScore: 4.7,
  },
  {
    id: 'x-bayesian-loop',
    source: 'X',
    author: '@bayes_gym',
    title: 'Bayesian Belief Loop：如何让微习惯成为可持续奖励',
    summary:
      '数据科学家分享他如何把锻炼「信念强度」量化为后验概率，并用 90 天的日志证明信念更新曲线比「打卡天数」更能预测坚持度。',
    tags: ['多巴胺/奖励机制', '健身策略', '营养优化'],
    url: 'https://x.com/bayes_gym/status/1234567890',
    baseScore: 4.8,
  },
  {
    id: 'x-hormone-panel',
    source: 'X',
    author: '@endocrine_lab',
    title: '高压人群的激素面板：皮质醇、睾酮与睡眠深度的互相牵引',
    summary:
      '一份 500+ 样本的临床前数据指出：高工作压力+低睡眠人群，皮质醇-睾酮比值偏高；通过减少晚间蓝光暴露 + 20 分钟晚间散步 4 周后指标回落。',
    tags: ['压力水平与皮质醇', '睡眠与昼夜节律', '荷尔蒙与激素平衡'],
    url: 'https://x.com/endocrine_lab/status/987654321',
    baseScore: 4.5,
  },
  {
    id: 'reddit-social-anxiety',
    source: 'Reddit',
    community: 'r/socialanxiety',
    title: '高功能焦虑者的「会议前 6 分钟」策略',
    summary:
      '产品副总裁分享了他如何在大型发布会前，用「预测 -> 感受 -> 行动」的 6 分钟流程清理社交焦虑，并同步监测心率波动。',
    tags: ['人际关系焦虑', '职场压力', '内啡肽/幸福感'],
    url: 'https://www.reddit.com/r/socialanxiety/',
    baseScore: 4.4,
  },
  {
    id: 'x-parenting-cortisol',
    source: 'X',
    author: '@parentinglab',
    title: '「孩子睡不好 = 你压力更大」？家长皮质醇日曲线的真实数据',
    summary:
      '行为科学家分享 120 个家庭的追踪，指出当孩子睡眠质量稳定后，父母的晨间皮质醇下降 12%，焦虑评分下降 22%。',
    tags: ['子女与亲子关系', '睡眠与昼夜节律', '压力水平与皮质醇'],
    url: 'https://x.com/parentinglab/status/567893214',
    baseScore: 4.3,
  },
];


