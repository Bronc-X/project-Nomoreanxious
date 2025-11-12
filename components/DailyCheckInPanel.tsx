'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import { createClientSupabaseClient } from '@/lib/supabase-client';

type DailyWellnessLog = {
  id?: number;
  log_date: string;
  sleep_duration_minutes: number | null;
  sleep_quality: string | null;
  exercise_duration_minutes: number | null;
  mood_status: string | null;
  stress_level: number | null;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
};

interface DailyCheckInPanelProps {
  initialProfile: any;
  initialLogs: DailyWellnessLog[];
}

const sleepDurationOptions = [
  { label: '少于 4 小时', value: '180' },
  { label: '4 小时', value: '240' },
  { label: '5 小时', value: '300' },
  { label: '6 小时', value: '360' },
  { label: '6.5 小时', value: '390' },
  { label: '7 小时', value: '420' },
  { label: '7.5 小时', value: '450' },
  { label: '8 小时', value: '480' },
  { label: '9 小时以上', value: '540' },
];

const sleepQualityOptions = [
  { label: '恢复极佳', value: 'excellent' },
  { label: '恢复良好', value: 'good' },
  { label: '一般', value: 'average' },
  { label: '浅睡多梦', value: 'poor' },
  { label: '断续/失眠', value: 'very_poor' },
];

const exerciseDurationOptions = [
  { label: '未运动', value: '0' },
  { label: '10 分钟', value: '10' },
  { label: '20 分钟', value: '20' },
  { label: '30 分钟', value: '30' },
  { label: '45 分钟', value: '45' },
  { label: '60 分钟', value: '60' },
  { label: '90 分钟以上', value: '90' },
];

const moodOptions = ['专注平稳', '轻松愉悦', '略感疲惫', '焦虑紧绷', '情绪低落', '亢奋躁动'];

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', weekday: 'short' });
  } catch {
    return dateString;
  }
};

export default function DailyCheckInPanel({ initialProfile, initialLogs }: DailyCheckInPanelProps) {
  const supabase = createClientSupabaseClient();
  const [logs, setLogs] = useState<DailyWellnessLog[]>(initialLogs || []);
  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todayLog = useMemo(() => logs.find((log) => log.log_date === todayKey) || null, [logs, todayKey]);

  const [formState, setFormState] = useState({
    sleepDuration: '',
    sleepQuality: '',
    exerciseDuration: '',
    moodStatus: '',
    stressLevel: '',
    notes: '',
  });
  const [reminderTime, setReminderTime] = useState(
    initialProfile?.daily_checkin_time ? (initialProfile.daily_checkin_time as string).slice(0, 5) : ''
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingReminder, setIsUpdatingReminder] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const hasPromptedRef = useRef(false);

  const shouldPrompt = useMemo(() => {
    if (todayLog) return false;
    if (!reminderTime) return true;
    const [hours, minutes] = reminderTime.split(':').map((item) => Number(item));
    const reminderMoment = new Date();
    reminderMoment.setHours(hours, minutes, 0, 0);
    return Date.now() >= reminderMoment.getTime();
  }, [todayLog, reminderTime]);

  useEffect(() => {
    if (todayLog) {
      setFormState({
        sleepDuration: todayLog.sleep_duration_minutes !== null ? String(todayLog.sleep_duration_minutes) : '',
        sleepQuality: todayLog.sleep_quality || '',
        exerciseDuration: todayLog.exercise_duration_minutes !== null ? String(todayLog.exercise_duration_minutes) : '',
        moodStatus: todayLog.mood_status || '',
        stressLevel: todayLog.stress_level !== null ? String(todayLog.stress_level) : '',
        notes: todayLog.notes || '',
      });
    } else {
      const fallbackSleepMinutes = initialProfile?.sleep_hours ? Number(initialProfile.sleep_hours) * 60 : '';
      setFormState({
        sleepDuration: fallbackSleepMinutes ? String(Math.round(fallbackSleepMinutes / 30) * 30) : '',
        sleepQuality: '',
        exerciseDuration: '',
        moodStatus: '',
        stressLevel: initialProfile?.stress_level ? String(initialProfile.stress_level) : '',
        notes: '',
      });
    }
  }, [todayLog, initialProfile?.sleep_hours, initialProfile?.stress_level]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (shouldPrompt && !hasPromptedRef.current) {
      setToast('提醒：按照设定的时间记录今日状态，以便持续更新你的生理基线。');
      hasPromptedRef.current = true;
    }
  }, [shouldPrompt]);

  const updateFormField = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveLog = async () => {
    if (!initialProfile?.id) return;
    setIsSaving(true);
    setToast(null);

    const payload = {
      user_id: initialProfile.id,
      log_date: todayKey,
      sleep_duration_minutes: formState.sleepDuration ? Number(formState.sleepDuration) : null,
      sleep_quality: formState.sleepQuality || null,
      exercise_duration_minutes: formState.exerciseDuration ? Number(formState.exerciseDuration) : null,
      mood_status: formState.moodStatus || null,
      stress_level: formState.stressLevel ? Number(formState.stressLevel) : null,
      notes: formState.notes || null,
    };

    const { data, error } = await supabase
      .from('daily_wellness_logs')
      .upsert(payload, { onConflict: 'user_id,log_date' })
      .select()
      .single();

    if (error) {
      console.error('保存每日记录失败:', error);
      setToast('保存失败，请稍后重试。');
      setIsSaving(false);
      return;
    }

    setLogs((prev) => {
      const otherLogs = prev.filter((log) => log.log_date !== todayKey);
      return [data, ...otherLogs].sort((a, b) => (a.log_date < b.log_date ? 1 : -1));
    });

    setToast('今日记录已更新。');
    setIsSaving(false);
  };

  const handleUpdateReminder = async () => {
    if (!initialProfile?.id) return;
    setIsUpdatingReminder(true);
    setToast(null);

    const { error } = await supabase
      .from('profiles')
      .update({
        daily_checkin_time: reminderTime ? `${reminderTime}:00` : null,
      })
      .eq('id', initialProfile.id);

    if (error) {
      console.error('更新提醒时间失败:', error);
      setToast('提醒时间更新失败，请稍后重试。');
      setIsUpdatingReminder(false);
      return;
    }

    setToast(reminderTime ? `提醒时间已设置为 ${reminderTime}` : '提醒时间已清除。');
    setIsUpdatingReminder(false);
  };

  const historyLogs = useMemo(
    () =>
      logs
        .filter((log) => log.log_date !== todayKey)
        .sort((a, b) => (a.log_date < b.log_date ? 1 : -1))
        .slice(0, 6),
    [logs, todayKey]
  );

  return (
    <AnimatedSection inView variant="fadeUp" className="mb-8">
      <div
        className={`rounded-2xl border ${
          shouldPrompt ? 'border-[#0B3D2E]' : 'border-[#E7E1D6]'
        } bg-white p-6 shadow-sm transition-shadow duration-300`}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#0B3D2E]">今日生理信号记录</h2>
            <p className="mt-1 text-sm text-[#0B3D2E]/70">
              按照设置的提醒时间，快速记录睡眠、运动、心情与压力；这些数据会直接影响 AI 的建议。
            </p>
          </div>
          <div className="flex flex-col items-end text-sm text-[#0B3D2E]/60">
            <span>记录日期：{formatDate(todayKey)}</span>
            {todayLog?.updated_at && (
              <span>
                最近更新：{new Date(todayLog.updated_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>

        {toast && (
          <div className="mt-4 rounded-lg border border-[#0B3D2E]/20 bg-[#0B3D2E]/5 px-4 py-3 text-sm text-[#0B3D2E]">
            {toast}
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0B3D2E] mb-2">睡眠时长</label>
              <div className="grid grid-cols-2 gap-2">
                {sleepDurationOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => updateFormField('sleepDuration', option.value)}
                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                      formState.sleepDuration === option.value
                        ? 'border-[#0B3D2E] bg-[#0B3D2E] text-white shadow-md'
                        : 'border-[#E7E1D6] bg-[#FFFDF8] text-[#0B3D2E] hover:border-[#0B3D2E]/40 hover:text-[#0B3D2E]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B3D2E] mb-2">睡眠评分</label>
              <div className="grid grid-cols-2 gap-2">
                {sleepQualityOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => updateFormField('sleepQuality', option.value)}
                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                      formState.sleepQuality === option.value
                        ? 'border-[#0B3D2E] bg-[#0B3D2E] text-white shadow-md'
                        : 'border-[#E7E1D6] bg-[#FFFDF8] text-[#0B3D2E] hover:border-[#0B3D2E]/40 hover:text-[#0B3D2E]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B3D2E] mb-2">运动时长</label>
              <div className="grid grid-cols-2 gap-2">
                {exerciseDurationOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => updateFormField('exerciseDuration', option.value)}
                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                      formState.exerciseDuration === option.value
                        ? 'border-[#0B3D2E] bg-[#0B3D2E] text-white shadow-md'
                        : 'border-[#E7E1D6] bg-[#FFFDF8] text-[#0B3D2E] hover:border-[#0B3D2E]/40 hover:text-[#0B3D2E]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0B3D2E] mb-2">心情状态</label>
              <div className="grid grid-cols-2 gap-2">
                {moodOptions.map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => updateFormField('moodStatus', option)}
                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                      formState.moodStatus === option
                        ? 'border-[#0B3D2E] bg-[#0B3D2E] text-white shadow-md'
                        : 'border-[#E7E1D6] bg-[#FFFDF8] text-[#0B3D2E] hover:border-[#0B3D2E]/40 hover:text-[#0B3D2E]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B3D2E] mb-2">压力等级（1-10）</label>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, index) => {
                  const value = String(index + 1);
                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => updateFormField('stressLevel', value)}
                      className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                        formState.stressLevel === value
                          ? 'border-[#0B3D2E] bg-[#0B3D2E] text-white shadow-md'
                          : 'border-[#E7E1D6] bg-[#FFFDF8] text-[#0B3D2E] hover:border-[#0B3D2E]/40 hover:text-[#0B3D2E]'
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-[#0B3D2E]/60">7 以上意味着你的皮质醇可能处于高位，建议进行最低阻力的缓解动作。</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B3D2E] mb-2">额外备注（可选）</label>
              <textarea
                value={formState.notes}
                onChange={(event) => updateFormField('notes', event.target.value)}
                rows={3}
                placeholder="记录任何你认为重要的触发因素或生理反馈……"
                className="w-full rounded-md border border-[#E7E1D6] bg-[#FFFDF8] px-3 py-2 text-sm text-[#0B3D2E] focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#0B3D2E]">提醒时间</label>
            <input
              type="time"
              value={reminderTime}
              onChange={(event) => setReminderTime(event.target.value)}
              onBlur={handleUpdateReminder}
              className="rounded-md border border-[#E7E1D6] bg-[#FFFDF8] px-3 py-2 text-sm text-[#0B3D2E] focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20"
            />
            <button
              type="button"
              onClick={handleUpdateReminder}
              disabled={isUpdatingReminder}
              className="rounded-md border border-[#0B3D2E]/30 px-3 py-1.5 text-xs font-medium text-[#0B3D2E] transition-colors hover:border-[#0B3D2E] hover:bg-[#FAF6EF] disabled:opacity-60"
            >
              {isUpdatingReminder ? '保存中…' : '保存提醒'}
            </button>
          </div>
          <button
            type="button"
            onClick={handleSaveLog}
            disabled={isSaving}
            className="rounded-md bg-gradient-to-r from-[#0b3d2e] via-[#0a3427] to-[#06261c] px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md disabled:opacity-60"
          >
            {isSaving ? '保存中…' : '保存今日记录'}
          </button>
        </div>

        {historyLogs.length > 0 && (
          <div className="mt-8 rounded-xl border border-[#E7E1D6] bg-[#FAF6EF] p-4">
            <h3 className="text-sm font-semibold text-[#0B3D2E]">最近记录</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {historyLogs.map((log) => (
                <div key={log.log_date} className="rounded-lg border border-[#0B3D2E]/10 bg-white px-4 py-3 text-sm text-[#0B3D2E]/80">
                  <div className="flex items-center justify-between text-xs text-[#0B3D2E]/60">
                    <span>{formatDate(log.log_date)}</span>
                    {log.updated_at && (
                      <span>{new Date(log.updated_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1.5">
                    <p>睡眠：{log.sleep_duration_minutes ? `${Math.round(log.sleep_duration_minutes / 60 * 10) / 10} 小时` : '—'} · {log.sleep_quality ? sleepQualityOptions.find((option) => option.value === log.sleep_quality)?.label || '—' : '—'}</p>
                    <p>运动：{log.exercise_duration_minutes ? `${log.exercise_duration_minutes} 分钟` : '—'} · 心情：{log.mood_status || '—'}</p>
                    <p>压力：{log.stress_level ? `${log.stress_level}/10` : '—'}</p>
                    {log.notes && <p className="text-xs text-[#0B3D2E]/60">备注：{log.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}


