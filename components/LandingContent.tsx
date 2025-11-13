'use client';

import AnimatedSection from '@/components/AnimatedSection';
import StatCurve from '@/components/StatCurve';
import Link from 'next/link';
import { motion } from 'framer-motion';
import XFeed from '@/components/XFeed';
import PersonalizedLandingContent from '@/components/PersonalizedLandingContent';
import WeatherGreeting from '@/components/WeatherGreeting';
import HealingIllustration from '@/components/HealingIllustration';

interface LandingContentProps {
  user?: {
    id: string;
    email?: string;
  } | null;
  profile?: any;
  habitLogs?: any[];
  dailyLogs?: any[];
}

export default function LandingContent({
  user,
  profile,
  habitLogs = [],
  dailyLogs = [],
}: LandingContentProps) {
  const safeDailyLogs = Array.isArray(dailyLogs) ? dailyLogs : [];
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayLog = safeDailyLogs.find((log) => log.log_date === todayKey);
  const lastLog = safeDailyLogs[0];
  const formatLogDate = (value: string) => {
    try {
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) {
        return value;
      }
      return parsed.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', weekday: 'short' });
    } catch {
      return value;
    }
  };
  const lastLogText = lastLog ? formatLogDate(lastLog.log_date) : '暂无历史记录';
  const todayStatusText = todayLog ? '今日记录已完成' : '今日尚未记录';
  const reminderTime = profile?.daily_checkin_time ? String(profile.daily_checkin_time).slice(0, 5) : null;
  const displayName =
    (profile?.full_name && String(profile.full_name).trim().length > 0
      ? String(profile.full_name).trim()
      : undefined) ||
    (user?.email ? user.email.split('@')[0] : undefined) ||
    '用户';

  return (
    <>
      {user && profile && (
        <>
          <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
            <AnimatedSection inView variant="fadeUp">
              <div className="rounded-2xl border border-[#E7E1D6] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#0B3D2E]/60">个人状态中心</span>
                    <div className="flex items-center gap-4 flex-wrap">
                      <h2 className="text-2xl font-semibold text-[#0B3D2E] sm:text-3xl">{displayName}，</h2>
                      <WeatherGreeting />
                    </div>
                    <p className="text-sm text-[#0B3D2E]/70">
                      {todayStatusText} · 最近记录：{todayLog ? '今天' : lastLog ? lastLogText : '暂无历史数据'}
                    </p>
                  </div>
                  <div className="grid w-full max-w-xl grid-cols-3 gap-3 lg:max-w-2xl">
                    <div className="rounded-lg border border-[#E7E1D6] bg-[#FAF6EF] px-3 py-3 text-center">
                      <p className="text-[11px] uppercase tracking-widest text-[#0B3D2E]/60">提醒时间</p>
                      <p className="mt-1 text-base font-semibold text-[#0B3D2E]">{reminderTime ?? '未设置'}</p>
                    </div>
                    <div className="rounded-lg border border-[#E7E1D6] bg-[#FAF6EF] px-3 py-3 text-center">
                      <p className="text-[11px] uppercase tracking-widest text-[#0B3D2E]/60">今日状态</p>
                      <p className="mt-1 text-base font-semibold text-[#0B3D2E]">{todayStatusText}</p>
                    </div>
                    <div className="rounded-lg border border-[#E7E1D6] bg-[#FAF6EF] px-3 py-3 text-center">
                      <p className="text-[11px] uppercase tracking-widest text-[#0B3D2E]/60">7日完成率</p>
                      <p className="mt-1 text-base font-semibold text-[#0B3D2E]">
                        {(() => {
                          const lastSevenDates = Array.from({ length: 7 }, (_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() - i);
                            return date.toISOString().slice(0, 10);
                          });
                          const completionCount = lastSevenDates.filter(date => 
                            safeDailyLogs.some(log => log.log_date === date)
                          ).length;
                          return `${Math.round((completionCount / 7) * 100)}%`;
                        })()}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#E7E1D6] bg-[#FAF6EF] px-3 py-3 text-center">
                      <p className="text-[11px] uppercase tracking-widest text-[#0B3D2E]/60">平均睡眠</p>
                      <p className="mt-1 text-base font-semibold text-[#0B3D2E]">
                        {(() => {
                          const lastSevenLogs = safeDailyLogs
                            .filter(log => {
                              const logDate = new Date(log.log_date);
                              const sevenDaysAgo = new Date();
                              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                              return logDate >= sevenDaysAgo;
                            })
                            .slice(0, 7);
                          if (lastSevenLogs.length === 0) return '待记录';
                          const sleepSum = lastSevenLogs.reduce((sum, log) => {
                            if (log.sleep_duration_minutes) {
                              return sum + (log.sleep_duration_minutes / 60);
                            }
                            return sum;
                          }, 0);
                          const sleepCount = lastSevenLogs.filter(log => log.sleep_duration_minutes).length;
                          if (sleepCount === 0) return '待记录';
                          return `${(sleepSum / sleepCount).toFixed(1)}h`;
                        })()}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#E7E1D6] bg-[#FAF6EF] px-3 py-3 text-center">
                      <p className="text-[11px] uppercase tracking-widest text-[#0B3D2E]/60">平均压力</p>
                      <p className="mt-1 text-base font-semibold text-[#0B3D2E]">
                        {(() => {
                          const lastSevenLogs = safeDailyLogs
                            .filter(log => {
                              const logDate = new Date(log.log_date);
                              const sevenDaysAgo = new Date();
                              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                              return logDate >= sevenDaysAgo;
                            })
                            .slice(0, 7);
                          if (lastSevenLogs.length === 0) return '待记录';
                          const stressSum = lastSevenLogs.reduce((sum, log) => {
                            if (log.stress_level) return sum + log.stress_level;
                            return sum;
                          }, 0);
                          const stressCount = lastSevenLogs.filter(log => log.stress_level).length;
                          if (stressCount === 0) return '待记录';
                          return `${(stressSum / stressCount).toFixed(1)}/10`;
                        })()}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#E7E1D6] bg-[#FAF6EF] px-3 py-3 text-center">
                      <p className="text-[11px] uppercase tracking-widest text-[#0B3D2E]/60">平均运动</p>
                      <p className="mt-1 text-base font-semibold text-[#0B3D2E]">
                        {(() => {
                          const lastSevenLogs = safeDailyLogs
                            .filter(log => {
                              const logDate = new Date(log.log_date);
                              const sevenDaysAgo = new Date();
                              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                              return logDate >= sevenDaysAgo;
                            })
                            .slice(0, 7);
                          if (lastSevenLogs.length === 0) return '待记录';
                          const exerciseSum = lastSevenLogs.reduce((sum, log) => {
                            if (log.exercise_duration_minutes) return sum + log.exercise_duration_minutes;
                            return sum;
                          }, 0);
                          const exerciseCount = lastSevenLogs.filter(log => log.exercise_duration_minutes).length;
                          if (exerciseCount === 0) return '待记录';
                          return `${Math.round(exerciseSum / exerciseCount)}min`;
                        })()}
                      </p>
                    </div>
                    <div className="col-span-3 rounded-lg border border-[#E7E1D6] bg-[#FFFDF8] px-3 py-3">
                      <p className="text-[11px] uppercase tracking-widest text-[#0B3D2E]/60">快速操作</p>
                      <div className="mt-2 space-y-2">
                        <Link
                          href="/assistant?panel=daily"
                          className="inline-flex items-center rounded-md border border-[#0B3D2E]/30 px-3 py-1.5 text-xs font-medium text-[#0B3D2E] transition-colors hover:border-[#0B3D2E] hover:bg-[#FAF6EF]"
                        >
                          记录今日状态
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </section>
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <PersonalizedLandingContent habitLogs={habitLogs} profile={profile} dailyLogs={safeDailyLogs} />
          </section>
        </>
      )}

      {/* Slogan Section - 居中显示 */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden">
        {/* 治愈插图装饰 */}
        <div className="absolute top-10 left-10 opacity-20">
          <HealingIllustration variant="leaf" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <HealingIllustration variant="circle" />
        </div>
        <div className="absolute top-1/2 left-1/4 opacity-15">
          <HealingIllustration variant="breath" />
        </div>
        <AnimatedSection inView variant="fadeUp" className="text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-block">
              {['我', '们', '是'].map((char, idx) => (
                <motion.span
                  key={idx}
                  className="text-base sm:text-lg text-[#0B3D2E]/80 font-medium inline-block cursor-default"
                  whileHover={{ scale: 1.3, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0B3D2E] tracking-tight">
              {['No', 'More', 'anxious'].map((word, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block cursor-default"
                  whileHover={{ scale: 1.15, y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  style={{ display: 'inline-block', marginRight: '0.2em' }}
                >
                  {word}
                </motion.span>
              ))}
              <motion.sup
                className="text-2xl sm:text-3xl md:text-4xl align-super inline-block cursor-default"
                whileHover={{ scale: 1.4, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                ™
              </motion.sup>
            </h1>
            <div className="mt-8 max-w-2xl mx-auto">
              <p className="text-xl sm:text-2xl md:text-3xl italic text-[#0B3D2E] font-light leading-relaxed">
                {['我们的逻辑很简单：', '通过解决焦虑，', '来解锁身体的潜能。'].map((phrase, idx) => (
                  <motion.span
                    key={idx}
                    className="inline-block cursor-default"
                    whileHover={{ scale: 1.1, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    style={{ display: 'inline-block' }}
                  >
                    {phrase}
                  </motion.span>
                ))}
              </p>
              <motion.div
                className="mt-4 text-sm sm:text-base text-[#0B3D2E]/60 font-medium inline-block cursor-default"
                whileHover={{ scale: 1.2, x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                — ASD
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Hero */}
      <section className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${user && profile ? 'pt-6' : 'pt-10'}`}>
        <AnimatedSection inView variant="fadeUp" className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#0B3D2E]">
              我们来聊聊你的状态
              <span className="block text-2xl sm:text-3xl md:text-4xl mt-1">（*坦诚地）</span>
            </h1>

            {/* 副标题/核心价值 */}
            <p className="mt-5 text-base leading-7 text-[#0B3D2E]/80">30+的你，正处于你人生的上升期。</p>
            <p className="mt-3 text-base leading-7 text-[#0B3D2E]/80">事业有成，思维敏锐。</p>
            <p className="mt-3 text-base leading-7 text-[#0B3D2E]/80">但你也开始注意到一些"变化"：</p>
            <p className="mt-2 text-base leading-7 text-[#0B3D2E]/80">新陈代谢不再是你最好的朋友；熬夜之后恢复时间变得很长；睡眠没有以前好...</p>

            {/* 强调段（合并为同一框内） */}
            <div className="mt-5 rounded-lg border border-[#E7E1D6] bg-[#0B3D2E]/5 p-4">
              <p className="text-lg leading-8 text-[#0B3D2E] font-semibold">欢迎来到一个不同的世界。我们坦诚地接受生理科学：</p>
              <p className="mt-2 text-base leading-7 text-[#0B3D2E] font-bold">生理上的新陈代谢正在发生不可逆转的改变。我们不与真相为敌。</p>
            </div>

            {/* 版本对比 */}
            <div id="pricing" className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 scroll-mt-20">
              {/* Free版 */}
              <div className="rounded-lg border border-[#E7E1D6] bg-white p-6 shadow-sm flex flex-col">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-[#0B3D2E] mb-2">Free版</h3>
                  <div className="text-3xl font-bold text-[#0B3D2E]">￥0</div>
                </div>
                <ul className="space-y-3 text-sm text-[#0B3D2E]/80 flex-1">
                  <li className="flex items-start">
                    <span className="text-[#0B3D2E] mr-2">✓</span>
                    <span>基础生理数据记录</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B3D2E] mr-2">✓</span>
                    <span>每日状态记录</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B3D2E] mr-2">✓</span>
                    <span>基础数据可视化</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B3D2E] mr-2">✓</span>
                    <span>社区内容浏览</span>
                  </li>
                </ul>
                <button className="mt-auto rounded-md border border-[#E7E1D6] bg-white text-[#0B3D2E] px-4 py-2 text-sm font-medium hover:bg-[#FAF6EF] transition-colors">
                  免费使用
                </button>
              </div>

              {/* Pro版 */}
              <Link href="/pricing?plan=pro" className="rounded-lg border-2 border-[#0B3D2E] bg-gradient-to-br from-[#0B3D2E]/5 to-white p-6 shadow-md relative flex flex-col cursor-pointer hover:shadow-lg transition-all">
                <div className="absolute top-0 right-0 bg-[#0B3D2E] text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  推荐
                </div>
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-[#0B3D2E] mb-2">Pro版</h3>
                  <div className="text-3xl font-bold text-[#0B3D2E]">￥15<span className="text-base font-normal text-[#0B3D2E]/60">/月</span></div>
              </div>
                <ul className="space-y-3 text-sm text-[#0B3D2E]/80 flex-1">
                  <li className="flex items-start">
                    <span className="text-[#0B3D2E] mr-2">✓</span>
                    <span>Free版所有功能</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B3D2E] mr-2">✓</span>
                    <span>AI个性化建议</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B3D2E] mr-2">✓</span>
                    <span>高级数据分析和趋势预测</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B3D2E] mr-2">✓</span>
                    <span>智能提醒功能</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B3D2E] mr-2">✓</span>
                    <span>优先客服支持</span>
                  </li>
                </ul>
                <button className="mt-auto rounded-md bg-gradient-to-r from-[#0b3d2e] via-[#0a3427] to-[#06261c] text-white px-4 py-2 text-sm font-medium hover:shadow-md transition-all">
                  立即升级
                </button>
              </Link>

              {/* Pro+版 */}
              <Link href="/pricing?plan=proplus" className="rounded-lg border border-[#E7E1D6] bg-white p-6 shadow-sm flex flex-col cursor-pointer hover:shadow-lg transition-all">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-[#0B3D2E] mb-2">Pro+版</h3>
                  <div className="text-3xl font-bold text-[#0B3D2E]">￥99<span className="text-base font-normal text-[#0B3D2E]/60">/月</span></div>
              </div>
                <ul className="space-y-3 text-sm text-[#0B3D2E]/80 flex-1">
                  <li className="flex items-start">
                    <span className="text-[#0B3D2E] mr-2">✓</span>
                    <span>Pro版所有功能</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B3D2E] mr-2">✓</span>
                    <span>一对一健康顾问咨询</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B3D2E] mr-2">✓</span>
                    <span>定制化健康计划</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B3D2E] mr-2">✓</span>
                    <span>深度生理信号分析</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B3D2E] mr-2">✓</span>
                    <span>专属AI助理</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B3D2E] mr-2">✓</span>
                    <span>无限数据导出</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B3D2E] mr-2">✓</span>
                    <span>24/7优先支持</span>
                  </li>
                </ul>
                <button className="mt-auto rounded-md border border-[#0B3D2E] bg-white text-[#0B3D2E] px-4 py-2 text-sm font-medium hover:bg-[#0B3D2E] hover:text-white transition-colors">
                  选择Pro+
                </button>
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-3">
              {!user && (
                <>
                  <Link href="#cta" className="rounded-md bg-[#0B3D2E] text-white px-4 py-2 text-sm hover:bg-[#0a3629]">
                    获取早期访问权限
                  </Link>
                  <Link href="#debug" className="text-sm text-[#0B3D2E] underline">
                    准备好 No More anxious™ 了吗？
                  </Link>
                </>
              )}
              {user && (
                <Link
                  href="/assistant"
                  className="rounded-md bg-gradient-to-r from-[#0b3d2e] via-[#0a3427] to-[#06261c] text-white px-4 py-2 text-sm hover:shadow-md transition-all"
                >
                  进入 AI 助理
                </Link>
              )}
            </div>
            {!user && <p className="mt-2 text-xs text-[#0B3D2E]/60">加入Beta候补名单。</p>}
          </div>
          <div className="bg-[#FFFDF8] border border-[#E7E1D6] rounded-lg p-4 relative">
            {/* 治愈插图装饰 */}
            <div className="absolute top-2 right-2 opacity-10">
              <HealingIllustration variant="wave" className="w-16 h-8" />
            </div>
            <StatCurve />
            <p className="mt-2 text-xs text-[#0B3D2E]/60">
              基于您的Ai助手对日常活动水平，您的基础数据表现，以及日常你的问题汇总，经过算法来呈现您身体状态的改善。
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-md border border-[#E7E1D6] bg-white p-3">
                <div className="text-xs text-[#0B3D2E]/60">代谢恢复</div>
                <div className="mt-1 text-sm font-medium text-[#0B3D2E]">↑ 12%</div>
              </div>
              <div className="rounded-md border border-[#E7E1D6] bg-white p-3">
                <div className="text-xs text-[#0B3D2E]/60">睡眠质量</div>
                <div className="mt-1 text-sm font-medium text-[#0B3D2E]">↑ 9%</div>
              </div>
              <div className="rounded-md border border-[#E7E1D6] bg-white p-3">
                <div className="text-xs text-[#0B3D2E]/60">焦虑基线</div>
                <div className="mt-1 text-sm font-medium text-[#0B3D2E]">↓ 18%</div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Insights title (kept), cards removed */}
      <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 scroll-mt-20">
        <AnimatedSection inView variant="fadeUp">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0B3D2E] leading-tight">
            <span className="block">健康产业是"噪音"。</span>
            <span className="block">生理信号是"真相"。</span>
          </h2>
          <div className="mt-6 grid md:grid-cols-3 gap-4 items-stretch">
            {/* 认知负荷 */}
            <div className="group rounded-2xl p-[1px] bg-gradient-to-br from-[#E7E1D6] to-transparent h-full">
              <motion.div
                whileHover={{ scale: 1.04, translateY: -2 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="relative rounded-2xl border border-[#E7E1D6] bg-white/90 backdrop-blur p-6 shadow-md transition-all group-hover:shadow-lg h-full flex flex-col overflow-hidden"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #0B3D2E 1px, transparent 1px), linear-gradient(to bottom, #0B3D2E 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                  }}
                />
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#0B3D2E]/60">Cognitive Load</div>
                <div className="mt-1 text-xl font-medium text-[#0B3D2E]">"认知负荷"已满。</div>
                <div className="mt-3 text-[#0B3D2E]/80 space-y-3">
                  <p>你知道有氧和力量训练；你懂得区分优质的蛋白质、脂肪和碳水。你明白要保证充足的睡眠。</p>
                  <p>但身体仍然像一个失控的"黑匣子"。</p>
                  <p>你发现，只是更努力地去坚持这些"规则"，并不是最终的答案。</p>
                </div>
              </motion.div>
            </div>

            {/* 打卡游戏 */}
            <div className="group rounded-2xl p-[1px] bg-gradient-to-br from-[#E7E1D6] to-transparent h-full">
              <motion.div
                whileHover={{ scale: 1.04, translateY: -2 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="relative rounded-2xl border border-[#E7E1D6] bg-white/90 backdrop-blur p-6 shadow-md transition-all group-hover:shadow-lg h-full flex flex-col overflow-hidden"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #0B3D2E 1px, transparent 1px), linear-gradient(to bottom, #0B3D2E 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                  }}
                />
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#0B3D2E]/60">Habit Streaks</div>
                <div className="mt-1 text-xl font-medium text-[#0B3D2E]">打卡游戏好玩吗？</div>
                <p className="mt-3 text-[#0B3D2E]/80">
                  许多健康App依赖"羞耻感"和"强制打卡"。功能越来越多，认知负荷越来越重，却不触及"根本原因"。你的身体并没有崩溃，它只是在诚实地对压力做出反应。
                </p>
              </motion.div>
            </div>

            {/* 信号 */}
            <div className="group rounded-2xl p-[1px] bg-gradient-to-br from-[#E7E1D6] to-transparent h-full">
              <motion.div
                whileHover={{ scale: 1.04, translateY: -2 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="relative rounded-2xl border border-[#E7E1D6] bg-white/90 backdrop-blur p-6 shadow-md transition-all group-hover:shadow-lg h-full flex flex-col overflow-hidden"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #0B3D2E 1px, transparent 1px), linear-gradient(to bottom, #0B3D2E 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                  }}
                />
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#0B3D2E]/60">The Signal</div>
                <div className="mt-1 text-xl font-medium text-[#0B3D2E]">信号：接受生理真相。</div>
                <p className="mt-3 text-[#0B3D2E]/80">
                  我们承认新陈代谢的不可逆趋势，但可以选择"反应"。先解决"焦虑"（领先指标），自然改善"身体机能"（滞后指标）。不对抗真相，与真相和解。
                </p>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Core Solution Section (moved below insights) */}
      <section id="model" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        <AnimatedSection inView variant="fadeUp">
          <div className="rounded-2xl border border-[#E7E1D6] bg-[#FFFDF8] p-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#0B3D2E]">解决思路</h2>
            <p className="mt-2 text-sm text-[#0B3D2E]/70">这是 No More anxious™ 的核心方法论。</p>
            <div className="mt-6 grid md:grid-cols-3 gap-4 items-stretch">
              {/* Card 1 */}
              <motion.div
                whileHover={{ scale: 1.06, translateY: -2 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="relative rounded-2xl border border-[#E7E1D6] bg-white p-6 shadow-md hover:shadow-lg overflow-hidden"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #0B3D2E 1px, transparent 1px), linear-gradient(to bottom, #0B3D2E 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                  }}
                />
                <div className="pointer-events-none absolute right-3 top-3 h-5 w-5 rounded-sm bg-[#0B3D2E]/10 border border-[#0B3D2E]/20" />

                <div className="text-[11px] font-mono uppercase tracking-wider text-[#0B3D2E]/60">Agent</div>
                <h3 className="mt-1 text-xl font-medium text-[#0B3D2E]">您的专属"健康代理"</h3>
                <p className="mt-3 text-[#0B3D2E]/80">这不是一个AI聊天机器人。</p>
                <p className="mt-2 text-[#0B3D2E] font-semibold">它冷血，因为它只会基于唯一的规则："生理真相"。</p>
                <p className="mt-2 text-[#0B3D2E]/80">
                  它不会说"加油！"。它会说："你现在感到焦虑，意味着你的皮质醇已达峰值。一个5分钟的步行是为了'代谢'你的压力激素。"
                </p>
                <div className="mt-4">
                  <Link
                    href="/assistant"
                    className="group relative inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#0b3d2e] via-[#0a3427] to-[#06261c] shadow-[0_0_24px_rgba(11,61,46,0.35)] hover:shadow-[0_0_36px_rgba(11,61,46,0.5)] transition-all focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/40"
                  >
                    <span className="absolute inset-0 rounded-md ring-1 ring-white/10" />
                    <span className="relative">点击进入你的 AI 助理</span>
                    <span className="pointer-events-none absolute -inset-px rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.10), rgba(255,255,255,0))' }} />
                    <span className="pointer-events-none absolute left-[-30%] top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-0 group-hover:translate-x-[260%] transition-transform duration-1000 ease-out" />
                  </Link>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                whileHover={{ scale: 1.02, translateY: -1 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="relative rounded-2xl border border-[#E7E1D6] bg-white p-6 shadow-md hover:shadow-lg overflow-hidden h-full flex flex-col"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #0B3D2E 1px, transparent 1px), linear-gradient(to bottom, #0B3D2E 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                  }}
                />
                <div className="pointer-events-none absolute right-3 top-3 h-5 w-5 rounded-sm bg-[#0B3D2E]/10 border border-[#0B3D2E]/20" />

                <div className="text-[11px] font-mono uppercase tracking-wider text-[#0B3D2E]/60">Bayesian</div>
                <h3 className="mt-1 text-xl font-medium text-[#0B3D2E]">"贝叶斯信念"循环</h3>
                <p className="mt-3 text-[#0B3D2E]/80">
                  我们从来不为"打卡天数"而焦虑。我们只关心"信念强度"。每次行动后，你将评估："这在起作用的确信度(1-10)"。我们帮你可视化"信心曲线"。
                </p>
                <div className="mt-auto pt-4 text-xs text-[#0B3D2E]/60">
                  参考：后验置信度随可验证信号更新（Bayes' theorem，
                  <a className="underline" href="https://en.wikipedia.org/wiki/Bayes%27_theorem" target="_blank" rel="noreferrer">
                    https://en.wikipedia.org/wiki/Bayes%27_theorem
                  </a>
                  ）
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                whileHover={{ scale: 1.06, translateY: -2 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="relative rounded-2xl border border-[#E7E1D6] bg-white p-6 shadow-md hover:shadow-lg overflow-hidden h-full flex flex-col"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #0B3D2E 1px, transparent 1px), linear-gradient(to bottom, #0B3D2E 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                  }}
                />
                <div className="pointer-events-none absolute right-3 top-3 h-5 w-5 rounded-sm bg-[#0B3D2E]/10 border border-[#0B3D2E]/20" />

                <div className="text-[11px] font-mono uppercase tracking-wider text-[#0B3D2E]/60">Minimum Dose</div>
                <h3 className="mt-1 text-xl font-medium text-[#0B3D2E]">最低有效剂量</h3>
                <p className="mt-3 text-[#0B3D2E]/80">
                  你不需要每天锻炼1小时，那太累了。你只需要在"线索"出现时，执行"最低阻力"的"反应"（如步行5分钟）。我们帮你识别并建立这些"微习惯"，直到它们成为"自动脚本"。
                </p>
                <div className="mt-auto pt-4 text-xs text-[#0B3D2E]/60">
                  参考：运动与奖赏/上瘾机制综述（NCBI，
                  <a className="underline" href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3181597/" target="_blank" rel="noreferrer">
                    https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3181597/
                  </a>
                  ）
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Authority Feed (static) */}
      <section id="authority" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6 scroll-mt-20">
        <AnimatedSection inView variant="fadeUp" className="rounded-xl border border-[#E7E1D6] bg-white p-6">
          <h2 className="text-2xl font-semibold text-[#0B3D2E]">一个没有"噪音"的信息流。</h2>
          <p className="mt-3 text-[#0B3D2E]/80">
            我们从 X、顶级权威健康研报、Reddit 热议组等为您精选了该领域最顶尖的生理学家、神经科学家和表现专家的核心见解。
            没有励志名言，没有低效"技巧"，只有可执行的数据和第一性原理。
            <span className="block mt-1 text-[#0B3D2E]/60 text-xs">
              (The internet is 99% noise and 1% signal. We've done the filtering for you. We curate core insights from top physiologists, neuroscientists, and performance experts on X (formerly Twitter). No motivational quotes, no inefficient 'hacks.' Just actionable data and first principles.)
            </span>
          </p>
          <div className="mt-4">
            <XFeed variant="bare" compact columns={2} limit={4} />
          </div>
          <div className="mt-4 rounded-md border border-[#E7E1D6] bg-[#FFFDF8] p-4">
            <div className="text-xs text-[#0B3D2E]/60">参考阅读</div>
            <div className="mt-2 text-sm text-[#0B3D2E]/90">胆固醇过低与心理健康风险的相关性综述（英文）。</div>
            <a
              className="mt-2 inline-block text-xs text-[#0B3D2E] underline"
              href="https://www.healthline.com/health/cholesterol-can-it-be-too-low"
              target="_blank"
              rel="noreferrer"
            >
              Healthline：Can My Cholesterol Be Too Low?
            </a>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA with code vibe */}
      {!user && (
        <section id="cta" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 scroll-mt-20">
          <AnimatedSection inView variant="springScaleIn" className="rounded-xl border border-[#E7E1D6] bg-white p-6">
            <h3 className="text-xl font-semibold text-[#0B3D2E]">准备好 No More anxious™ 了吗？</h3>
            <p className="mt-2 text-[#0B3D2E]/80">获取抢先体验版。</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 grid sm:grid-cols-[1fr_auto] gap-3"
            >
              <input
                type="email"
                placeholder="your@email"
                className="w-full rounded-md border border-[#E7E1D6] bg-[#FFFDF8] px-3 py-2 font-mono text-sm text-[#0B3D2E] placeholder:text-[#0B3D2E]/40 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20"
              />
              <button
                type="submit"
                className="rounded-md bg-[#0B3D2E] px-4 py-2 text-sm text-white hover:bg-[#0a3629]"
              >
                加入候补名单
              </button>
            </form>
            <div className="mt-3 text-xs text-[#0B3D2E]/60 font-mono">
              {'//'} 仅收集邮箱。提交即表示同意我们的隐私政策。
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-[#E7E1D6] bg-[#FAF6EF]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-xs text-[#0B3D2E]/70 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div>© 2025 NMa</div>
          <div className="flex flex-wrap gap-3">
            <Link href="#model" className="hover:text-[#0B3D2E]">科学模型</Link>
            <Link href="/privacy" className="hover:text-[#0B3D2E]">隐私政策</Link>
            <Link href="/terms" className="hover:text-[#0B3D2E]">服务条款</Link>
            <Link href="/contact" className="hover:text-[#0B3D2E]">联系我们</Link>
          </div>
        </div>
      </footer>
    </>
  );
}

