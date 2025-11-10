Project Goal
启动一个MVP，帮助30-45岁用户通过建立微小、可持续的日常习惯来对抗新陈代谢衰退，核心是缓解心理焦虑，而非强制打卡。

Tech Stack
Frontend: Next.js (使用 App Router)

Styling: Tailwind CSS

Backend: Supabase (用于认证和数据库)

Deployment: Vercel

Target User
30-45岁，高压力，开始感知身体机能下降（如新陈代谢变慢），对健康指标感到焦虑，但排斥“硬核”健身APP的强制文化。

Core Feature 1: Habit Loop
基于"Cue-Response-Reward"（线索-反应-奖励）模型构建习惯追踪器。

用户需定义“线索”（例如，“下午3点感到焦虑”），“反应”（例如，“步行5分钟”），“奖励”（例如，“记录一件积极的小事”）。

重点是不做成标准打卡器，而是强调行动与焦虑缓解的联系。

Core Feature 2: "Special Agent" (MVP)
这不是一个AI聊天机器人。

它是一个基于用户入职（Onboarding）问卷（如年龄、主要担忧）的规则推荐系统。

示例：如果(担忧="焦虑" AND 活动水平="低")，则推荐：“生理真相：您的神经系统可能已超负荷。最简单的行动是5分钟步行，运动能消耗皮质醇。”

Core Feature 3: Bayesian Confidence
我们将使用“贝叶斯定理”的概念。

用户在记录一个习惯后，会被问及一个问题：“您在多大程度上‘相信’这个习惯正在帮助您缓解焦虑？（1-10分）”。

应用需追踪这个“信念分数”随时间的变化曲线。

Core Feature 4: X.com Feed
应用内需要一个“灵感”板块，静态https://www.google.com/search?q=%E5%B1%95%E7%A4%BA%E6%9D%A5%E8%87%AA%E7%89%B9%E5%AE%9AX.com领域权威博主的帖子。

我们将使用react-tweet库，该库不需要API。

Styling & Tone
使用Tailwind CSS。

UI必须简洁、平静、专业。避免鲜艳的颜色、徽章或排行榜。

色调应为“平静的蓝色/灰色/白色”。

文案应是支持性的、科学的、非评判性的。