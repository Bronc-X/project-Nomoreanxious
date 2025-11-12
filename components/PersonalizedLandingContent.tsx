'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import BeliefScoreChart from './BeliefScoreChart';
import { autoGroupData } from '@/lib/chartUtils';
import AnimatedSection from './AnimatedSection';
import { trendingTopics } from '@/data/trendingTopics';

interface PersonalizedLandingContentProps {
  habitLogs: any[];
  profile: any;
  dailyLogs: any[];
}

export default function PersonalizedLandingContent({
  habitLogs,
  profile,
  dailyLogs,
}: PersonalizedLandingContentProps) {
  const [chartData, setChartData] = useState<{ period: string; averageScore: number }[]>([]);

  useEffect(() => {
    if (habitLogs && habitLogs.length > 0) {
      const { beliefData } = autoGroupData(habitLogs);
      setChartData(beliefData);
    }
  }, [habitLogs]);

  const clampScore = (value: number) => Math.min(100, Math.max(0, value));

  const bodyFunctionScore = useMemo(() => {
    const rawScore = profile?.body_function_score;
    if (rawScore !== undefined && rawScore !== null && !Number.isNaN(Number(rawScore))) {
      return clampScore(Number(rawScore));
    }

    let score = 60;

    const sleepHours = profile?.sleep_hours ? Number(profile.sleep_hours) : null;
    if (sleepHours) {
      if (sleepHours >= 7) score += 12;
      else if (sleepHours >= 6) score += 6;
      else score -= 8;
    }

    const stressLevel = profile?.stress_level ? Number(profile.stress_level) : null;
    if (stressLevel) {
      if (stressLevel >= 7) score -= 12;
      else if (stressLevel >= 5) score -= 6;
      else score += 4;
    }

    const energyLevel = profile?.energy_level ? Number(profile.energy_level) : null;
    if (energyLevel) {
      if (energyLevel >= 7) score += 8;
      else if (energyLevel <= 4) score -= 6;
    }

    const exerciseFrequency = profile?.exercise_frequency as string | undefined;
    if (exerciseFrequency) {
      if (['每周4-5次', '每周6-7次', '每天多次'].includes(exerciseFrequency)) {
        score += 8;
      } else if (exerciseFrequency === '每周2-3次') {
        score += 4;
      } else if (exerciseFrequency === '几乎不运动') {
        score -= 8;
      }
    }

    const chronicConditions = Array.isArray(profile?.chronic_conditions) ? profile.chronic_conditions : [];
    if (chronicConditions.length > 0) {
      score -= Math.min(12, chronicConditions.length * 4);
    }

    return clampScore(score);
  }, [
    profile?.body_function_score,
    profile?.sleep_hours,
    profile?.stress_level,
    profile?.energy_level,
    profile?.exercise_frequency,
    profile?.chronic_conditions,
  ]);

  const scoreLabel = useMemo(() => {
    if (bodyFunctionScore >= 85) return '状态极佳，保持你的节奏。';
    if (bodyFunctionScore >= 70) return '状态良好，继续巩固核心习惯。';
    if (bodyFunctionScore >= 55) return '需要关注恢复与压力管理。';
    return '警惕持续的高压与睡眠不足，优先处理焦虑触发点。';
  }, [bodyFunctionScore]);

  const focusTopics: string[] = useMemo(() => {
    if (Array.isArray(profile?.primary_focus_topics)) {
      return profile.primary_focus_topics;
    }
    return [];
  }, [profile?.primary_focus_topics]);

  const reminderTime = useMemo(() => {
    if (!profile?.daily_checkin_time) return null;
    const timeString = profile.daily_checkin_time as string;
    return timeString.slice(0, 5);
  }, [profile?.daily_checkin_time]);

  const waterLevel = bodyFunctionScore;
  const waterHeight = (240 * waterLevel) / 100;

  const chronicConditions = useMemo(() => {
    if (Array.isArray(profile?.chronic_conditions)) {
      return profile.chronic_conditions.filter((item: string) => item !== '无');
    }
    return [];
  }, [profile?.chronic_conditions]);

  const sleepSummary = profile?.sleep_hours
    ? `${Number(profile.sleep_hours).toFixed(1).replace(/\.0$/, '')} 小时`
    : '待记录';
  const stressSummary = profile?.stress_level ? `${profile.stress_level} / 10` : '待记录';
  const energySummary = profile?.energy_level ? `${profile.energy_level} / 10` : '待记录';
  const exerciseSummary = profile?.exercise_frequency || '待填写';

  const lastSevenDates = useMemo(() => {
    const dates: string[] = [];
    const base = new Date();
    for (let index = 0; index < 7; index += 1) {
      const date = new Date(base);
      date.setDate(base.getDate() - index);
      dates.push(date.toISOString().slice(0, 10));
    }
    return dates;
  }, []);

  const dailyStats = useMemo(() => {
    if (!dailyLogs || dailyLogs.length === 0) {
      return {
        completionRate: 0,
        averageSleepHours: null as number | null,
        averageStress: null as number | null,
      };
    }

    let completionCount = 0;
    let sleepSum = 0;
    let sleepCount = 0;
    let stressSum = 0;
    let stressCount = 0;

    const logMap = new Map<string, any>(dailyLogs.map((log: any) => [log.log_date, log]));

    lastSevenDates.forEach((dateKey) => {
      const log = logMap.get(dateKey);
      if (log) {
        completionCount += 1;
        if (typeof log.sleep_duration_minutes === 'number' && log.sleep_duration_minutes > 0) {
          sleepSum += log.sleep_duration_minutes / 60;
          sleepCount += 1;
        }
        if (typeof log.stress_level === 'number' && log.stress_level > 0) {
          stressSum += log.stress_level;
          stressCount += 1;
        }
      }
    });

    return {
      completionRate: Math.round((completionCount / lastSevenDates.length) * 100),
      averageSleepHours: sleepCount > 0 ? Number((sleepSum / sleepCount).toFixed(1)) : null,
      averageStress: stressCount > 0 ? Number((stressSum / stressCount).toFixed(1)) : null,
    };
  }, [dailyLogs, lastSevenDates]);

  const averageSleepDisplay =
    dailyStats.averageSleepHours !== null ? `${dailyStats.averageSleepHours} 小时` : '待记录';
  const averageStressDisplay =
    dailyStats.averageStress !== null ? `${dailyStats.averageStress}/10` : '待记录';

  const matchedTopics = useMemo(() => {
    const focusSet = new Set(focusTopics);
    return trendingTopics
      .map((topic) => {
        const overlapTags = topic.tags.filter((tag) => focusSet.has(tag));
        let score = topic.baseScore + overlapTags.length * 0.25;

        if (dailyStats.averageStress !== null && dailyStats.averageStress >= 7 && topic.tags.includes('压力水平与皮质醇')) {
          score += 0.25;
        }
        if (dailyStats.averageSleepHours !== null && dailyStats.averageSleepHours < 6.5 && topic.tags.includes('睡眠与昼夜节律')) {
          score += 0.2;
        }
        if (bodyFunctionScore < 60 && topic.tags.some((tag) => ['老化与长寿', '荷尔蒙与激素平衡', '营养优化'].includes(tag))) {
          score += 0.15;
        }
        if (bodyFunctionScore >= 80 && topic.tags.includes('健身策略')) {
          score += 0.1;
        }

        const matchScore = Math.min(5, Math.max(3.5, Number(score.toFixed(1))));

        return {
          ...topic,
          overlapTags,
          matchScore,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4);
  }, [focusTopics, dailyStats.averageStress, dailyStats.averageSleepHours, bodyFunctionScore]);

  // 生成个性化建议
  const getPersonalizedAdvice = () => {
    const advice: string[] = [];

    if (profile?.ai_analysis_result) {
      const analysis = profile.ai_analysis_result;

      if (analysis.cortisol_pattern === 'elevated') {
        advice.push('你的皮质醇水平较高，建议在感到压力时进行5分钟步行来代谢压力激素。');
      }

      if (analysis.sleep_quality === 'poor') {
        advice.push('你的睡眠质量需要改善，建议晚上9点后调暗灯光，停止使用电子设备。');
      }

      if (analysis.recovery_capacity === 'low') {
        advice.push('你的恢复能力较低，建议进行10分钟轻度运动（如拉伸、慢走），避免高强度训练。');
      }

      if (analysis.risk_factors && analysis.risk_factors.length > 0) {
        if (analysis.risk_factors.includes('睡眠不足')) {
          advice.push('关注睡眠时长，确保每晚7-9小时的睡眠。');
        }
        if (analysis.risk_factors.includes('高压力水平')) {
          advice.push('压力管理很重要，尝试在感到焦虑时进行深呼吸练习。');
        }
      }
    }

    if (profile?.ai_recommendation_plan?.micro_habits) {
      const habits = profile.ai_recommendation_plan.micro_habits;
      if (habits.length > 0) {
        advice.push(`你已定制了 ${habits.length} 个微习惯，记住关注"信念强度"而非完成率。`);
      }
    }

    if (advice.length === 0) {
      advice.push('继续关注你的生理信号，记住：我们不对抗真相，与真相和解。');
    }

    return advice;
  };

  const personalizedAdvice = getPersonalizedAdvice();

  return (
    <>
      <AnimatedSection inView variant="fadeUp" className="mt-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#E7E1D6] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="relative mx-auto h-60 w-28">
                <svg width="120" height="240" viewBox="0 0 120 240" className="h-full w-full">
                  <defs>
                    <clipPath id="bodyClip">
                      <circle cx="60" cy="30" r="26" />
                      <rect x="35" y="52" width="50" height="70" rx="25" />
                      <rect x="42" y="120" width="36" height="90" rx="18" />
                    </clipPath>
                    <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0B3D2E" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#0B3D2E" stopOpacity="0.55" />
                    </linearGradient>
                  </defs>
                  <rect width="120" height="240" fill="#0B3D2E" opacity="0.12" clipPath="url(#bodyClip)" />
                  <rect
                    x="0"
                    y={Math.max(0, 240 - waterHeight)}
                    width="120"
                    height={Math.max(0, waterHeight)}
                    fill="url(#waterGradient)"
                    clipPath="url(#bodyClip)"
                  />
                  <circle cx="60" cy="30" r="26" fill="none" stroke="#0B3D2E" strokeWidth="3" opacity="0.35" />
                  <rect x="35" y="52" width="50" height="70" rx="25" fill="none" stroke="#0B3D2E" strokeWidth="3" opacity="0.35" />
                  <rect x="42" y="120" width="36" height="90" rx="18" fill="none" stroke="#0B3D2E" strokeWidth="3" opacity="0.35" />
                </svg>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold text-[#0B3D2E]">{Math.round(bodyFunctionScore)}</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#0B3D2E]/60">Body Score</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-[#0B3D2E]">身体机能指数</h3>
                  <p className="mt-1 text-sm text-[#0B3D2E]/70">{scoreLabel}</p>
                </div>
                <ul className="space-y-2 text-sm text-[#0B3D2E]/80">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0B3D2E]" />
                    <span>睡眠节奏：{sleepSummary}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0B3D2E]" />
                    <span>压力等级：{stressSummary}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0B3D2E]" />
                    <span>能量充沛度：{energySummary}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0B3D2E]" />
                    <span>运动频率：{exerciseSummary}</span>
                  </li>
                </ul>
                {chronicConditions.length > 0 && (
                  <div className="rounded-lg border border-[#E7E1D6] bg-[#FAF6EF] px-3 py-2 text-xs text-[#0B3D2E]/70">
                    <span className="font-medium text-[#0B3D2E]">基础状况：</span>
                    {chronicConditions.join('、')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E7E1D6] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[#0B3D2E]">每日记录与提醒</h3>
                <p className="mt-1 text-sm text-[#0B3D2E]/70">
                  记录睡眠、运动、心情与压力，让 AI 能够捕捉趋势并更新你的贝叶斯信念循环。
                </p>
              </div>
              <div className="rounded-lg border border-[#E7E1D6] bg-[#FAF6EF] px-4 py-3 text-sm text-[#0B3D2E]/80">
                <p>
                  提醒时间：{' '}
                  <span className="font-medium text-[#0B3D2E]">
                    {reminderTime ? `${reminderTime}` : '未设置，点击下方按钮立即设置'}
                  </span>
                </p>
                <p className="mt-1 text-xs text-[#0B3D2E]/60">我们会在该时间点发送提醒，确保你不会错过每日复盘。</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-[#E7E1D6] bg-[#FFFDF8] px-3 py-3 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-[#0B3D2E]/60">过去 7 日完成率</p>
                  <p className="mt-1 text-lg font-semibold text-[#0B3D2E]">{dailyStats.completionRate}%</p>
                </div>
                <div className="rounded-lg border border-[#E7E1D6] bg-[#FFFDF8] px-3 py-3 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-[#0B3D2E]/60">平均睡眠</p>
                  <p className="mt-1 text-lg font-semibold text-[#0B3D2E]">{averageSleepDisplay}</p>
                </div>
                <div className="rounded-lg border border-[#E7E1D6] bg-[#FFFDF8] px-3 py-3 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-[#0B3D2E]/60">平均压力</p>
                  <p className="mt-1 text-lg font-semibold text-[#0B3D2E]">{averageStressDisplay}</p>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[#0B3D2E]/60">关注焦点</h4>
                {focusTopics.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {focusTopics.map(topic => (
                      <span
                        key={topic}
                        className="rounded-full border border-[#0B3D2E]/30 bg-[#FFFDF8] px-3 py-1 text-xs text-[#0B3D2E]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-[#0B3D2E]/60">还没有设置关注话题，去资料页选择你最关心的焦虑触发点。</p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/assistant?panel=daily"
                  className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[#0b3d2e] via-[#0a3427] to-[#06261c] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
                >
                  记录今日状态
                </Link>
                <Link
                  href="/assistant?panel=profile"
                  className="inline-flex items-center justify-center rounded-md border border-[#0B3D2E]/30 px-4 py-2 text-sm font-medium text-[#0B3D2E] transition-colors hover:border-[#0B3D2E] hover:bg-[#FAF6EF]"
                >
                  调整提醒与主题
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* 个人习惯记录曲线 */}
      {chartData.length > 0 && (
        <AnimatedSection inView variant="fadeUp" className="mt-8">
          <BeliefScoreChart data={chartData} />
        </AnimatedSection>
      )}

      {/* 个性化建议 */}
      {personalizedAdvice.length > 0 && (
        <AnimatedSection inView variant="fadeUp" className="mt-8">
          <div className="rounded-lg border border-[#E7E1D6] bg-[#FFFDF8] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#0B3D2E] mb-4">为你定制的建议</h3>
            <p className="text-sm text-[#0B3D2E]/70 mb-4">
              基于你的个人资料和记录数据，以下是你应该注意的事项：
            </p>
            <ul className="space-y-3">
              {personalizedAdvice.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#0B3D2E] flex-shrink-0" />
                  <p className="text-sm text-[#0B3D2E]/80">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>
      )}

      {matchedTopics.length > 0 && (
        <AnimatedSection inView variant="fadeUp" className="mt-8">
          <div className="rounded-2xl border border-[#E7E1D6] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#0B3D2E]">高赞生理话题匹配</h3>
                <p className="text-sm text-[#0B3D2E]/70">
                  从 Reddit / X 过滤噪音，推送与你关注主题高度相关的科学讨论与数据洞察。
                </p>
              </div>
              <div className="rounded-full border border-[#0B3D2E]/20 bg-[#FAF6EF] px-4 py-1.5 text-xs uppercase tracking-widest text-[#0B3D2E]/60">
                匹配度 ≥ 3.5 星
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {matchedTopics.map((topic) => (
                <div key={topic.id} className="group flex h-full flex-col gap-3 rounded-xl border border-[#E7E1D6] bg-[#FFFDF8] p-5 transition hover:border-[#0B3D2E]/30 hover:shadow-md">
                  <div className="flex items-center justify-between text-xs uppercase tracking-widest">
                    <span className="font-semibold text-[#0B3D2E]">
                      {topic.source === 'Reddit' ? topic.community || 'Reddit' : topic.author || 'X 热议'}
                    </span>
                    <span className="text-[#0B3D2E]/50">{topic.source}</span>
                  </div>
                  <h4 className="text-base font-semibold text-[#0B3D2E]">{topic.title}</h4>
                  <p className="text-sm text-[#0B3D2E]/70">{topic.summary}</p>
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#0B3D2E]/60">
                      <span>匹配度</span>
                      <span className="font-medium text-[#0B3D2E]">{topic.matchScore.toFixed(1)} / 5</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E7E1D6]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0b3d2e] via-[#0a3427] to-[#06261c]"
                        style={{ width: `${(topic.matchScore / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topic.overlapTags.length > 0 ? (
                      topic.overlapTags.map((tag) => (
                        <span key={tag} className="rounded-full border border-[#0B3D2E]/30 bg-white px-3 py-1 text-xs text-[#0B3D2E]">
                          {tag}
                        </span>
                      ))
                    ) : (
                      topic.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full border border-[#0B3D2E]/10 bg-white px-3 py-1 text-xs text-[#0B3D2E]/70">
                          {tag}
                        </span>
                      ))
                    )}
                  </div>
                  <div className="mt-auto">
                    <a
                      href={topic.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-sm font-medium text-[#0B3D2E] transition group-hover:text-[#0B3D2E]/80"
                    >
                      查看原帖 →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}
    </>
  );
}

