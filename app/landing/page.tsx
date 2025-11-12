import { getServerSession } from '@/lib/auth-utils';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import MarketingNav from '@/components/MarketingNav';
import LandingContent from '@/components/LandingContent';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const session = await getServerSession();
  let profile = null;
  let habitLogs: any[] = [];
  let dailyLogs: any[] = [];

  if (session?.user) {
    const supabase = await createServerSupabaseClient();

    // 获取用户资料
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!error && data) {
        profile = data;
      }
    } catch (error) {
      console.error('获取用户资料时出错:', error);
    }

    // 获取用户习惯和习惯记录
    if (profile) {
      try {
        // 获取用户习惯
        const { data: habits } = await supabase
          .from('user_habits')
          .select('id')
          .eq('user_id', session.user.id);

        if (habits && habits.length > 0) {
          const habitIds = habits.map(h => h.id);
          // 获取习惯记录
          const { data: logs } = await supabase
            .from('habit_log')
            .select('*')
            .in('habit_id', habitIds)
            .order('completed_at', { ascending: true });

          if (logs) {
            habitLogs = logs;
          }
        }
      } catch (error) {
        console.error('获取习惯记录时出错:', error);
      }
    }

    // 获取每日记录
    try {
      const { data: wellnessLogs, error: wellnessError } = await supabase
        .from('daily_wellness_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('log_date', { ascending: false })
        .limit(14);

      if (!wellnessError && wellnessLogs) {
        dailyLogs = wellnessLogs;
      }
    } catch (error) {
      console.error('获取每日记录时出错:', error);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      <MarketingNav user={session?.user || null} profile={profile} />
      <LandingContent user={session?.user || null} profile={profile} habitLogs={habitLogs} dailyLogs={dailyLogs} />
    </div>
  );
}
